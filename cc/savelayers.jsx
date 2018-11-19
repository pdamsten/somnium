//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Save Layer tab code
//
//**************************************************************************

exportFile = function(key)
{
  try {
    var path = settings.value(key, 'path');
    var filename = uniqueFilename(path, app.activeDocument.name, '.jpg');
    if (filename === false) {
      return LAST_MESSAGE;
    }
    var size = settings.value(key, 'maxsize').split('x');
    var minsize = settings.value(key, 'minsize').split('x');
    var color = settings.value(key, 'paddingcolor');
    color = color.substring(4, color.length - 1).replace(/ /g, '').split(',');
    if (saveAsJpeg(filename, parseInt(size[0]), parseInt(size[1]),
               parseInt(minsize[0]), parseInt(minsize[1]), color)) {
      var s = msg(INFO, 'Export', filename + ' saved succesfully.');
    } else {
      var s = msg(ERROR, 'Export', 'Saving ' + filename + ' failed.');
    }
    return s;
  } catch (e) {
    log(e);
  }
}

onSaveFbClick = function()
{
  return exportFile('SaveFb');
}

onSaveInstaClick = function()
{
  return exportFile('SaveInsta');
}

onSaveTwitterClick = function()
{
  return exportFile('SaveTwitter');
}

onSave4KClick = function()
{
  return exportFile('Save4K');
}

onExport1Click = function()
{
  return exportFile('Export1');
}

onExport2Click = function()
{
  return exportFile('Export2');
}

onExport3Click = function()
{
  return exportFile('Export3');
}

onExport4Click = function()
{
  return exportFile('Export4');
}

var pindex = 0;
var mogrify = '';
var ffmpeg = '';
var ffmpeglast = '';
var mainPath;
var docname = '';
var handledSmart = [];

var minLength = 3.5 // seconds
var maxLength = 10.0 // seconds
var defaultFps = 3.0

onSaveLayersClick = function()
{
  try {
    var t0 = Date.now();
    var path = settings.value('SaveLayers', 'path');
    var active = app.activeDocument;
    var parts = active.name.split(".");
    docname = parts[0];
    var newDoc = app.activeDocument.duplicate(randomString(8));

    if (active == newDoc) {
      return msg(ERROR, 'Save Layers', 'Could not make a duplicate.');
    }
    /* if (settings.value('SaveLayers', 'faster')) {
      newDoc.convertProfile('sRGB IEC61966-2.1', Intent.RELATIVECOLORIMETRIC, true, false);
      newDoc.bitsPerChannel = BitsPerChannelType.EIGHT;
    }*/
    mainPath = addPathSep(File(addPathSep(path) + docname).fsName);
    var layers = listLayers();
    //takeScreenshotsFromLayers(layers);
    pindex = 0;
    mogrify = '';
    ffmpeg = '';
    ffmpeglast = '';
    handledSmart = [];
    saveLayersAsJpgs(layers);

    newDoc.close(SaveOptions.DONOTSAVECHANGES);
    app.activeDocument = active;
    var t = Date.now() - t0;
    var m = Math.floor(t / 1000 / 60);
    var s = (t / 1000.0) % 60;
    log('SaveLayers took:', m, 'minutes', s, 'seconds');
    return msg(INFO, 'Save Layers', 'Layers saved to: ' + mainPath);
  } catch (e) {
    log(e);
  }
  return msg(ERROR, 'Save Layers', 'Saving layers failed.');
}

saveLayersAsJpgs = function(layers)
{
  handleLayers(layers, saveJpg);
}

saveJpg = function(layer)
{
  layer.visible = true;
  saveAsJpeg(output('layer-', '.jpg'), 3840, 2160);
}

hideAllLayers = function(layers)
{
  var len = layers.length;

  for (var i = 0; i < len; ++i) {
    if (!(layers[i].layer.typename == 'LayerSet')) {
      layers[i].layer.visible = false;
    }
  }
}

output = function(prefix, suffix)
{
  var dir = checkDir();
  var name = dir + prefix + padNum(++pindex, 4) + suffix;
  ffmpeglast = 'file ' + name + '\n';
  ffmpeg += ffmpeglast;
  mogrify += name + '\n';
  return name;
}

checkDir = function()
{
  var s = addPathSep(File(mainPath).fsName);
  mkdir(s);
  return s;
}

// flags
// m = show with and without mask
// s = open smart object (default)
// f = show with and without smart filters
// r = Main (RAW) layer

flags = function(layer, main)
{
  var main = (typeof main === 'undefined') ? false : main;
  if (main) {
    var f = {
      mask: true,
      filter: true,
      smartObject: true,
      main: true
    };
  } else {
    var f = {
      mask: false,
      filter: false,
      smartObject: true,
      main: false
    };
  }
  var n = layer.name.indexOf('(?');
  var v = true;
  if (n > 0) {
    n += 2
    while (n < layer.name.length) {
      if (layer.name[n] == '-') {
        v = false;
        ++n;
        continue;
      } else if (layer.name[n] == ')') {
        break;
      } else if (layer.name[n] == 'm') {
        f.mask = v;
      } else if (layer.name[n] == 'f') {
        f.filter = v;
      } else if (layer.name[n] == 's') {
        f.smartObject = v;
      } else if (layer.name[n] == 'r') {
        f.main = v;
      }
      ++n;
    }
  }
  return f;
}

handleLayers = function(layers, func)
{
  var lmain = findMain(layers);
  var masks = false;

  hideAllLayers(layers);
  if (lmain != -1) {
    handleMain(lmain, layers, func);
  }
  for (var i = layers.length - 1; i >= 0; --i) {
    var layer = layers[i].layer;
    var f = flags(layer);
    if (i == lmain || !layers[i].visible) {
      continue;
    }
    if (layer.kind == LayerKind.SMARTOBJECT) {
      var info = smartObjectInfo(layers[i].layer);
      //log(layer.name, f.smartObject, info['type'], info['fileref']);
      if (info != false && info['type'] == 'photoshop' && f.smartObject) {
        if (!(arrayContains(handledSmart, info['fileref']))) {
          handledSmart.push(info['fileref']);
          if (editSmartObjectContents(layer)) {
            if (app.activeDocument.layers.length > 1) {
              var smlayers = listLayers();
              handleLayers(smlayers, func);
            }
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
          }
        }
      }
    }
    if (layer.typename == 'LayerSet') {
      if (f.mask) {
        if (enableLayerMask(layer, false)) {
          func.apply(this, [layer]);
          enableLayerMask(layer, true);
        }
      }
    } else {
      if (f.filter) {
        enableSmartFilters(layer, false);
      }
      if (f.mask) {
        enableLayerMask(layer, false);
      }
      func.apply(this, [layer]);
      if (f.filter) {
        enableSmartFilters(layer, true);
        func.apply(this, [layer]);
      }
      if (f.mask) {
        enableLayerMask(layer, true);
        func.apply(this, [layer]);
      }
    }
  }

  var d = checkDir();
  writeTextFile(d + 'convert.txt', mogrify);
  writeTextFile(d + 'ffmpeg.txt', ffmpeg + ffmpeglast);

  var parts = app.activeDocument.name.split(".");
  var fname = parts[0];
  var fr = 0;
  var n = pindex - 1;
  var insta = '-vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2" ';
  var fullhd = '-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" ';
  var fourk = '-vf "scale=3840:2160:force_original_aspect_ratio=decrease,pad=3840:2160:(ow-iw)/2:(oh-ih)/2" ';

  if (n / defaultFps < minLength) {
      fr = n / minLength;
  } else if (n / defaultFps > maxLength) {
      fr = n / maxLength;
  } else {
      fr = defaultFps;
  }
  cmd1 = '#!/bin/bash\nffmpeg -f concat -safe 0 -r ' +  fr + ' -i "' + d + 'ffmpeg.txt" ';
  cmd2 = '-c:v libx264 -r 30 -pix_fmt yuv420p "' + d + fname;
  writeTextFile(d + 'ffmpeg-org.sh', cmd1 + cmd2 + '.mp4"\n');
  writeTextFile(d + 'ffmpeg-4k.sh', cmd1 + fourk + cmd2 + '-4k.mp4"\n');
  writeTextFile(d + 'ffmpeg-1080p.sh', cmd1 + fullhd + cmd2 + '-1080p.mp4"\n');
  writeTextFile(d + 'ffmpeg-insta.sh', cmd1 + insta + cmd2 + '-insta.mp4"\n');
}

findMain = function(layers)
{
  for (var i = layers.length - 1; i >= 0; --i) {
    var f = flags(layers[i].layer);
    if (f.main == true) {
      return i;
    }
  }
  for (var i = layers.length - 1; i >= 0; --i) {
    if (layers[i].layer.name == docname) {
      return i;
    }
  }
  /*
  for (var i = layers.length - 1; i >= 0; --i) {
    var info = smartObjectInfo(layers[i].layer);
    if (info != false && info['type'] == 'raw') {
      return i;
    }
  }
  */
  return -1;
}

handleMain = function(lmain, layers, func)
{
  var mainLayer = layers[lmain].layer;
  var i = lmain;
  var thereWasAMask = false;
  var thereWasSmartFilters = false;
  var mainCopy = null;
  var f = flags(mainLayer, true);

  if (f.mask) {
    while (i != -1) {
      if (enableLayerMask(layers[i].layer, false)) {
        thereWasAMask = true;
      }
      i = layers[i].parent;
    }
  }
  if (f.filter) {
    thereWasSmartFilters = enableSmartFilters(mainLayer, false);
  }
  if (f.smartObject && mainLayer.kind == LayerKind.SMARTOBJECT) {
    var info = smartObjectInfo(mainLayer);
    if (info) {
      if (info['type'] == 'photoshop') {
        if (!(arrayContains(handledSmart, info['fileref']))) {
          handledSmart.push(info['fileref']);
          if (editSmartObjectContents(mainLayer)) {
            if (app.activeDocument.layers.length > 1) {
              var smlayers = listLayers();
              handleLayers(smlayers, func);
            }
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
          }
        }
      }
      else if (info['type'] == 'raw') {
        if (newSmartObjectViaCopy(mainLayer)) {
          mainCopy = app.activeDocument.activeLayer;
          // Move out of any groups
          mainCopy.move(activeDocument, ElementPlacement.PLACEATBEGINNING);
          deleteLayerMask(mainCopy);
          deleteSmartFilters(mainCopy);
          editSmartObjectContents(mainCopy);
          mainCopy.visible = true;
          mainCopy.opacity = 100;
          func.apply(this, [mainCopy]);
          mainCopy.visible = false;
          mainCopy.remove();
        }
      }
    }
  }
  func.apply(this, [mainLayer]);
  if (thereWasSmartFilters) {
    enableSmartFilters(mainLayer, true);
    func.apply(this, [mainLayer]);
  }
  if (thereWasAMask) {
    i = lmain;
    while (i != -1) {
      enableLayerMask(layers[i].layer, true);
      i = layers[i].parent;
    }
    func.apply(this, [mainLayer]);
  }
}

// Experimental
takeScreenshot = function(layer)
{
  layer.visible = true;
  app.activeDocument.activeLayer = layer;
  app.refresh();
  app.system("/usr/sbin/screencapture -x -m -T 0 " + output('screenshot-', '.png'));
}

takeScreenshotsFromLayers = function(layers)
{
  app.refresh();
  waitForRedraw();
  //alert('Waiting...');
  handleLayers(takeScreenshot);
}
