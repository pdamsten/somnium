//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Main file for cc code
//
//**************************************************************************

function include(path)
{
  try {
    $.evalFile(path);
  } catch (e) {
    log(e);
  }
}

function init(jsxPath)
{
  try {
    include(jsxPath + 'log.jsx');
    initLog(jsxPath + '../log.txt');
    // libs
    include(jsxPath + 'util.jsx');
    include(jsxPath + 'layer.jsx');
    include(jsxPath + 'adjustment.jsx');
    include(jsxPath + 'adjustmentlayer.jsx');

    include(jsxPath + 'retouch.jsx');
  } catch (e) {
    log(e);
  }
}

function onLogoClick()
{
  openURL('http://petridamsten.com/');
}

msg = function(s)
{
  alert(s);
}

//**************************************************************************
//
//   Helpers tab code
//
//**************************************************************************

var helpGroupName = 'Help Layers';

function onMakeAllClick()
{
  try {
    onMakeSaturationMapClick();
    onMatchTonesClick();
    onMakeLightnessClick();
    onMakeSkinCheckerClick();
    onMakeSolarisationClick();
    onMakePerspectiveLinesClick();
    onMakeMemoClick();
  } catch (e) {
    log(e);
  }
}

function onMakeSolarisationClick()
{
  if (checkLayer('Solarisation', helpGroupName) != null) return;
  var c = [[0, 0], [26,225], [73,30], [109, 225], [145, 30], [182, 225], [219, 30], [255, 255]];

  group = checkGroup(helpGroupName);
  l = createCurveAdjustment('Solarisation', group);
  setCurveAdjustment(l, c);
  deleteLayerMask(l);
  l.visible = false;
}

function onMakeMemoClick()
{
  if (checkLayer('Memo', helpGroupName) != null) return;
  group = checkGroup(helpGroupName);
  createLayer('Memo', group);
}

function onMakeSkinCheckerClick()
{
  if (checkLayer('Skin Checker', helpGroupName) != null) return;
  group = checkGroup(helpGroupName);
  l = createChannelMixer('Skin Checker', group);
  setChannelMixer(l, [-46, -4, 200], 0, true);
  deleteLayerMask(l);
  l.visible = false;
}

function onMakePerspectiveLinesClick()
{
  if (checkLayer('Perspective Lines', helpGroupName) != null) return;
  var group = checkGroup(helpGroupName);
  var v = Math.max(app.activeDocument.width, app.activeDocument.height);
  var a = 15;
  var l;
  var layers = [];

  for (var i = 0; i < 12; ++i) {
    var n = 'Line ' + (i + 1);
    l = drawLine(n, 0, v/2, v, v/2, 0.2);
    rotateLayer(l, i * 15.0);
    scaleLayer(l, 5);
    layers.push(l);
  }
  var perspective = groupLayers('Perspective Lines', layers);
  perspective.visible = false;
}

function onMakeLightnessClick()
{
  if (checkLayer('Lightness', helpGroupName) != null) return;
  var group = checkGroup(helpGroupName);
  var l1 = createSolidColorAdjustment('Lightness Check', group, [128, 128, 128]);
  var l2 = createCurveAdjustment('Enhance', group);
  setLayerBlendingMode(l1, 'color');
  setCurveAdjustment(l2, scurve(10));
  deleteLayerMask(l1);
  deleteLayerMask(l2);
  group = groupLayers('Lightness', [l1, l2]);
  group.visible = false;
}

function onMatchTonesClick()
{
  if (checkLayer('Match Tones', helpGroupName) != null) return;
  var group = checkGroup(helpGroupName);
  var l1 = createSolidColorAdjustment('Luminosity', group, [128, 128, 128]);
  var l2 = createHueSaturationAdjustment('Enhance', group);
  setLayerBlendingMode(l1, 'luminosity');
  setHueSaturationAdjustment(l2, 0, 100, 0);
  deleteLayerMask(l1);
  deleteLayerMask(l2);
  group = groupLayers('Match Tones', [l1, l2]);
  group.visible = false;
}

function onMakeSaturationMapClick()
{
  if (checkLayer('Saturation Map', helpGroupName) != null) return;
  var group = checkGroup(helpGroupName);
  var l = createSelectiveColorAdjustment('Saturation Map', group);
  var values = [['reds',   [0, 0, 0, -100]], ['yellows',  [0, 0, 0, -100]],
                ['greens', [0, 0, 0, -100]], ['cyans',    [0, 0, 0, -100]],
                ['blues',  [0, 0, 0, -100]], ['magentas', [0, 0, 0, -100]],
                ['whites', [0, 0, 0,  100]], ['neutrals', [0, 0, 0, 100]],
                ['blacks', [0, 0, 0,  100]]];
  setSelectiveColorAdjustment(l, values, true);
  deleteLayerMask(l);
  l.visible = false;
}

function onDeleteAllClick()
{
  var group = findGroup(helpGroupName)
  if (group != null) {
    group.remove();
  }
}

//**************************************************************************
//
//   Save Layer tab code
//
//**************************************************************************

var pindex = 0;
var mogrify = '';
var ffmpeg = '';
var ffmpeglast = '';
var mainPath;

var minLength = 3.5 // seconds
var maxLength = 10.0 // seconds
var defaultFps = 3.0

onSaveLayers_BrowseClick = function(path)
{
  var save = new Folder(File(path).fsName);
  var folder = save.selectDlg('Folder for layer saver', '', false);
  return folder;
}

onSaveLayersClick = function(path)
{
  try {
    mainPath = File(path).fsName + '/';
    var layers = listLayers();
    //takeScreenshotsFromLayers(layers);
    saveLayersAsJpgs(layers);
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
  var parts = app.activeDocument.name.split(".");
  var fname = parts[0];
  var s = File(mainPath + fname).fsName + '/';
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
