//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Helpers tab code
//
//**************************************************************************

var helpGroupName = 'Help Layers';

onMakeAllClick = function()
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

onBlendIfClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;
    var l = createSolidColorAdjustment('Blend If Helper');
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.grouped = true; // Clipping mask
    setSolidColorAdjustment(l, [255, 0, 0]);
    l.opacity = 50;
    deleteLayerMask(l);
  } catch (e) {
    log(e);
  }
}

onMakeSolarisationClick = function()
{
  if (checkLayer('Solarisation', helpGroupName) != null) return;
  var c = [[0, 0], [26,225], [73,30], [109, 225], [145, 30], [182, 225], [219, 30], [255, 255]];

  group = checkGroup(helpGroupName);
  l = createCurveAdjustment('Solarisation', group);
  setCurveAdjustment(l, c);
  deleteLayerMask(l);
  l.visible = false;
}

const MemoStyles = {
  'colorOverlay': {
    'color': [255, 0, 55],
    'opacity': 100,
    'blendingmode': 'normal'
  },
  'stroke': {
    'size': 2,
    'position': 'outside',
    'blendingmode': 'normal',
    'opacity': 100,
    'overprint': false,
    'color': [0, 0, 0]
  }
}

onMakeMemoClick = function()
{
  try {
    if (checkLayer('Memo', helpGroupName) != null) return;
    var group = checkGroup(helpGroupName);
    var layer = createLayer('Memo', group, ElementPlacement.INSIDE);
    setLayerStyles(layer, MemoStyles);
    layer.opacity = 66;
  } catch (e) {
    log(e);
  }
}

onMakeSkinCheckerClick = function()
{
  if (checkLayer('Skin Check', helpGroupName) != null) return;
  group = checkGroup(helpGroupName);
  l = createChannelMixer('Skin Checker', group);
  setChannelMixer(l, [-46, -4, 200], 0, true);
  deleteLayerMask(l);
  l.visible = false;
}

onMakePerspectiveLinesClick = function()
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

onMakeLightnessClick = function()
{
  if (checkLayer('Luminosity Check', helpGroupName) != null) return;
  var group = checkGroup(helpGroupName);
  var l1 = createSolidColorAdjustment('Luminosity', group, [128, 128, 128]);
  var l2 = createCurveAdjustment('Enhance', group);
  setLayerBlendingMode(l1, 'color');
  setCurveAdjustment(l2, scurve(10));
  deleteLayerMask(l1);
  deleteLayerMask(l2);
  group = groupLayers('Luminosity Check', [l1, l2]);
  group.visible = false;
}

onMatchTonesClick = function()
{
  if (checkLayer('Hue Check', helpGroupName) != null) return;
  var group = checkGroup(helpGroupName);
  var l1 = createSolidColorAdjustment('Hue', group, [128, 128, 128]);
  var l2 = createHueSaturationAdjustment('Enhance', group);
  setLayerBlendingMode(l1, 'luminosity');
  setHueSaturationAdjustment(l2, 0, 100, 0);
  deleteLayerMask(l1);
  deleteLayerMask(l2);
  group = groupLayers('Hue Check', [l1, l2]);
  group.visible = false;
}

onMakeSaturationMapClick = function()
{
  if (checkLayer('Saturation Check', helpGroupName) != null) return;
  var group = checkGroup(helpGroupName);
  var l = createSelectiveColorAdjustment('Saturation Check', group);
  var values = {'reds':   [0, 0, 0, -100], 'yellows':  [0, 0, 0, -100],
                'greens': [0, 0, 0, -100], 'cyans':    [0, 0, 0, -100],
                'blues':  [0, 0, 0, -100], 'magentas': [0, 0, 0, -100],
                'whites': [0, 0, 0,  100], 'neutrals': [0, 0, 0, 100],
                'blacks': [0, 0, 0,  100]};
  setSelectiveColorAdjustment(l, values, true);
  deleteLayerMask(l);
  l.visible = false;
}

onDeleteAllClick = function()
{
  var group = findGroup(helpGroupName)
  if (group != null) {
    group.remove();
  }
}
