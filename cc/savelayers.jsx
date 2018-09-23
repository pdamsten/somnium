//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Save Layer tab code
//
//**************************************************************************

exportFile = function(key)
{
  var path = settings.value(key, 'path');
  var size = settings.value(key, 'maxsize').split('x');
  var minsize = settings.value(key, 'minsize').split('x');
  var color = settings.value(key, 'paddingcolor');
  color = color.substring(4, color.length - 1).replace(/ /g, '').split(',');
  saveAsJpeg(path + '/' + app.activeDocument.name + '.jpg', parseInt(size[0]), parseInt(size[1]),
             parseInt(minsize[0]), parseInt(minsize[1]), color);
}

onSaveFbClick = function()
{
  exportFile('SaveFb');
}

onSaveInstaClick = function()
{
  exportFile('SaveInsta');
}

onSaveTwitterClick = function()
{
  exportFile('SaveTwitter');
}

onSave4KClick = function()
{
  exportFile('Save4K');
}

onExport1Click = function()
{
  exportFile('SaveExport1');
}

onExport2Click = function()
{
  exportFile('SaveExport2');
}

onExport3Click = function()
{
  exportFile('SaveExport3');
}

onExport4Click = function()
{
  exportFile('SaveExport4');
}

var pindex = 0;
var mogrify = '';
var ffmpeg = '';
var ffmpeglast = '';
var mainPath;

var minLength = 3.5 // seconds
var maxLength = 10.0 // seconds
var defaultFps = 3.0

onSaveLayersClick = function()
{
  path = settings.value('SaveLayers', 'path');
  try {
    var active = app.activeDocument;
    var parts = active.name.split(".");
    var fname = parts[0];
    var newDoc = app.activeDocument.duplicate(randomString(8));

    mainPath = File(path + '/' + fname).fsName + '/';
    var layers = listLayers();
    //takeScreenshotsFromLayers(layers);
    saveLayersAsJpgs(layers);

    newDoc.close(SaveOptions.DONOTSAVECHANGES);
    app.activeDocument = active;
  } catch (e) {
    log(e);
  }
  return '';
}

saveLayersAsJpgs = function(layers)
{
  hideAllLayers(layers);
  handleLayers(layers, saveJpg);
}

saveJpg = function(n, layer)
{
  layer.visible = true;
  saveAsJpeg(output('layer-', n, '.jpg'), 3840, 2160);
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

output = function(prefix, n, suffix)
{
  var dir = checkDir();
  var name = dir + prefix + padNum(n + 1, 4) + suffix;
  ffmpeglast = 'file ' + name + '\n';
  ffmpeg += ffmpeglast;
  mogrify += name + '\n';
  return name;
}

checkDir = function()
{
  var s = File(mainPath).fsName + '/';
  mkdir(s);
  return s;
}

handleLayers = function(layers, func)
{
  pindex = 0;
  mogrify = '';
  ffmpeg = '';
  ffmpeglast = '';

  var lmain = findMain(layers);
  var masks = false;

  if (lmain != -1) {
    handleMain(lmain, layers, func);
  }
  for (var i = layers.length - 1; i >= 0; --i) {
    var layer = layers[i].layer;
    if (i == lmain || !layers[i].visible) {
      continue;
    }
    if (layer.typename == 'LayerSet') {
      if (masks) {
        if (enableLayerMask(layer, false)) {
          func.apply(this, [pindex++, layer]);
          enableLayerMask(layer, true);
        }
      }
    } else {
      if (masks) {
        if (enableLayerMask(layer, false)) {
          func.apply(this, [pindex++, layer]);
          enableLayerMask(layer, true);
        }
      }
      func.apply(this, [pindex++, layer]);
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
    if (layers[i].layer.name[0] == '#') {
      return i;
    }
  }
  for (var i = layers.length - 1; i >= 0; --i) {
    var info = smartObjectInfo(layers[i].layer);
    if (info != false && endsWith(info['fileref'], ".dng")) { // TODO how to check if RAW smart object
      return i;
    }
  }
  return -1;
}

handleMain = function(lmain, layers, func)
{
  var mainLayer = layers[lmain].layer;
  var i = lmain;
  var thereWasAMask = false;
  var thereWasSmartFilters = false;
  var mainCopy = null;

  while (i != -1) {
    if (enableLayerMask(layers[i].layer, false)) {
      thereWasAMask = true;
    }
    i = layers[i].parent;
  }
  thereWasSmartFilters = enableSmartFilters(mainLayer, false);
  if (mainLayer.kind == LayerKind.SMARTOBJECT) {
    if (newSmartObjectViaCopy(mainLayer)) {
      mainCopy = app.activeDocument.activeLayer;
      deleteLayerMask(mainCopy);
      deleteSmartFilters(mainCopy);
      editSmartObjectContents(mainCopy);
      mainCopy.visible = true;
      mainCopy.opacity = 100;
      func.apply(this, [pindex++, mainCopy]);
      mainCopy.visible = false;
      mainCopy.remove();
    }
  }
  func.apply(this, [pindex++, mainLayer]);
  if (thereWasSmartFilters) {
    enableSmartFilters(mainLayer, true);
    func.apply(this, [pindex++, mainLayer]);
  }
  if (thereWasAMask) {
    i = lmain;
    while (i != -1) {
      enableLayerMask(layers[i].layer, true);
      i = layers[i].parent;
    }
    func.apply(this, [pindex++, mainLayer]);
  }
}

// Experimental
takeScreenshot = function(n, layer)
{
  layer.visible = true;
  app.activeDocument.activeLayer = layer;
  app.refresh();
  app.system("/usr/sbin/screencapture -x -m -T 0 " + output('screenshot-', n, '.png'));
}

takeScreenshotsFromLayers = function(layers)
{
  hideAllLayers(layers);
  app.refresh();
  waitForRedraw();
  //alert('Waiting...');
  handleLayers(takeScreenshot);
}
