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
    var filename = Path.uniqueFilename(path, app.activeDocument.name, '.jpg');
    if (filename === false) {
      return UI.LAST_MESSAGE;
    }
    var size = settings.value(key, 'maxsize').split('x');
    var minsize = settings.value(key, 'minsize').split('x');
    var color = settings.value(key, 'paddingcolor');
    color = color.substring(4, color.length - 1).replace(/ /g, '').split(',');
    if (app.activeDocument.saveAsJpeg(filename, parseInt(size[0]), parseInt(size[1]),
                                      parseInt(minsize[0]), parseInt(minsize[1]), color)) {
      var s = UI.msg(UI.INFO, 'Export', filename + ' saved succesfully.');
    } else {
      var s = UI.msg(UI.ERROR, 'Export', 'Saving ' + filename + ' failed.');
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
    var newDoc = app.activeDocument.duplicate(String.random(8));

    if (active == newDoc) {
      return UI.msg(UI.ERROR, 'Save Layers', 'Could not make a duplicate.');
    }
    mainPath = addPathSep(File(addPathSep(path) + Path.simplename(docname)).fsName);
    var layers = getFlags(newDoc.listLayers());
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
    return UI.msg(UI.INFO, 'Save Layers', 'Layers saved to: ' + mainPath);
  } catch (e) {
    log(e);
  }
  return UI.msg(UI.ERROR, 'Save Layers', 'Saving layers failed.');
}

saveLayersAsJpgs = function(layers)
{
  handleLayers(layers, saveJpg);
}

saveJpg = function(layer)
{
  layer.visible = true;
  app.activeDocument.saveAsJpeg(output('layer-', '.jpg'), 3840, 2160);
}

getFlags = function(layers)
{
  for (var i = layers.length - 1; i >= 0; --i) {
    layers[i].layer.applyLocking(false, false, false, false);
    if (layers[i].visible) {
      layers[i].flags = flags(layers[i].layer);
    }
  }
  return layers;
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
  var name = dir + prefix + (++pindex).toString().padStart(4, '0') + suffix;
  ffmpeglast = 'file ' + name + '\n';
  ffmpeg += ffmpeglast;
  mogrify += name + '\n';
  return name;
}

checkDir = function()
{
  var s = addPathSep(File(mainPath).fsName);
  Path.mkdir(s);
  return s;
}

// flags
// m = show with and without mask
// s = open smart object
// f = show with and without smart filters
// r = Show these first
//
// Defaults
// PSB smart object => -m +s -f -r
// RAW smart object => -m -s -f -r
// Layer name == file name => +m +s +f +r
// Other layers => -m -s -f -r
//
// example (?ms) => show without mask and open smart object

default_flags = function(layer)
{
  if (layer.kind == LayerKind.SMARTOBJECT) {
    var info = layer.smartObjectInfo();
  } else {
    var info = false;
  }
  if (layer.name == docname) {
    var f = {
      mask: true,
      filter: true,
      smart: true,
      main: true
    };
  } else if (info != false && info['type'] == 'photoshop') {
    var f = {
      mask: false,
      filter: false,
      smart: true,
      main: false
    };
  } else {
    var f = {
      mask: false,
      filter: false,
      smart: false,
      main: false
    };
  }
  return f;
}

flags = function(layer)
{
  var f = default_flags(layer);
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
        f.smart = v;
      } else if (layer.name[n] == 'r') {
        f.main = v;
      }
      ++n;
    }
  }
  return f;
}

enableLayerMasks = function(layers, n, enable)
{
  i = n;
  hadMask = false;
  while (i != -1) {
    if (layers[i].layer.enableMask(enable)) {
      hadMask = true;
    }
    i = layers[i].parent;
  }
  return hadMask;
}

handleLayer = function(layers, n, func)
{
  var layer = layers[n].layer;
  // layers[n].visible == original visibility
  // layer.visible == already handled
  if (layer.visible || !layers[n].visible) {
    return;
  }
  //log(layer.name, layers[n].flags.smart, layer.visible, layers[n].visible); return;
  if (layer.kind == LayerKind.SMARTOBJECT && layers[n].flags.smart) {
    var info = layer.smartObjectInfo();
    if (info) {
      if (info['type'] == 'photoshop') {
        if (layer.editSmartObjectContents()) {
          var smlayers = getFlags(app.activeDocument.listLayers());
          if (smlayers.length > 1) {
            handleLayers(smlayers, func);
          }
          app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        }
      } else if (info['type'] == 'raw') {
        if (layer.newSmartObjectViaCopy()) {
          mainCopy = app.activeDocument.activeLayer;
          // Move out of any groups
          mainCopy.move(activeDocument, ElementPlacement.PLACEATBEGINNING);
          mainCopy.deleteMask();
          mainCopy.removeSmartFilters(mainCopy);
          mainCopy.editSmartObjectContents(mainCopy);
          mainCopy.visible = true;
          mainCopy.opacity = 100;
          func.apply(this, [mainCopy]);
          mainCopy.remove();
        }
      }
    }
  }
  if (layer.typename == 'LayerSet') {
    if (layers[n].flags.mask) {
      if (enableLayerMasks(layers, n, false)) {
        func.apply(this, [layer]);
        enableLayerMasks(layers, n, true);
      }
    }
  } else {
    if (layers[n].flags.filter) {
      layer.enableSmartFilters(false);
    }
    if (layers[n].flags.mask) {
      enableLayerMasks(layers, n, false);
    }
    func.apply(this, [layer]);
    if (layers[n].flags.filter) {
      if (layer.enableSmartFilters(true)) {
        func.apply(this, [layer]);
      }
    }
    if (layers[n].flags.mask) {
      if (enableLayerMasks(layers, n, true)) {
        func.apply(this, [layer]);
      }
    }
  }
}

findFirst = function(layers, func)
{
  var result = [];

  for (var i = 0; i < layers.length; ++i) {
    if (layers[i].visible && layers[i].flags.main) {
      result.push(i);
    }
    //log(layers[i].layer.name, f.main);
  }
  return result;
}

handleLayers = function(layers, func)
{
  var first = findFirst(layers);

  hideAllLayers(layers);

  for (var i = first.length - 1; i >= 0; --i) {
    handleLayer(layers, first[i], func);
  }

  for (var i = layers.length - 1; i >= 0; --i) {
    handleLayer(layers, i, func);
  }

  var d = checkDir();
  writeTextFile(d + 'convert.txt', mogrify);
  writeTextFile(d + 'ffmpeg.txt', ffmpeg + ffmpeglast);

  var fname = Path.simplename(docname);
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
