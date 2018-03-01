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
    include(jsxPath + 'adjustment.jsx');
    include(jsxPath + 'layer.jsx');
  } catch (e) {
    log(e);
  }
}

function onLogoClick()
{
  openURL('http://petridamsten.com/');
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
  setSelectiveColorAdjustment(l, 'reds', [0, 0, 0, -100]);
  setSelectiveColorAdjustment(l, 'yellows', [0, 0, 0, -100]);
  setSelectiveColorAdjustment(l, 'greens', [0, 0, 0, -100]);
  setSelectiveColorAdjustment(l, 'cyans', [0, 0, 0, -100]);
  setSelectiveColorAdjustment(l, 'blues', [0, 0, 0, -100]);
  setSelectiveColorAdjustment(l, 'magentas', [0, 0, 0, -100]);
  setSelectiveColorAdjustment(l, 'whites', [0, 0, 0, 100]);
  setSelectiveColorAdjustment(l, 'neutrals', [0, 0, 0, 100]);
  setSelectiveColorAdjustment(l, 'blacks', [0, 0, 0, 100]);
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

//layer.visible = true;
//saveJpg(output('p', n, '.jpg'), 3840, 2160);

onSaveLayersClick = function()
{
  var layers = listLayers();
  layers = layers.reverse();
  //takeScreenshotsFromLayers();
  saveLayersAsJpgs();
}

saveLayersAsJpgs = function()
{
  hideAllLayers();
  handleLayers(saveJpg);
}

pad = function(num, size)
{
  var s = '000000000' + num;
  return s.substr(s.length - size);
}

output = function(prefix, n, suffix)
{
  return '~/tmp/' + prefix + '-' + fname + '-' + pad(n + 1, 4) + suffix;
}

handleLayers = function(func)
{
  handleMain(func);

  var len = layers.length;

  for (var i = 0; i < len; ++i) {
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
}

handleMain = function(func)
{
  if (lmain != -1) {
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
}
// Experimental
takeScreenshot = function(n, layer)
{
  layer.visible = true;
  app.activeDocument.activeLayer = layer;
  app.refresh();
  app.system("/usr/sbin/screencapture -x -m -T 0 " + output('s', n, '.png'));
}

takeScreenshotsFromLayers = function()
{
  hideAllLayers();
  app.refresh();
  waitForRedraw();
  //alert('Waiting...');
  handleLayers(takeScreenshot);
}
