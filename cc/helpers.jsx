//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Helpers tab code
//
//**************************************************************************

const helpGroupName = 'Help Layers';
const grey50 = [128, 128, 128];
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
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var l = doc.addSolidColorAdjustment('Blend If Helper');
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.grouped = true; // Clipping mask
    l.setAdjustment([255, 0, 0]);
    l.opacity = 50;
    l.deleteMask(l);
  } catch (e) {
    log(e);
  }
}

onMakeSolarisationClick = function()
{
  try {
    var doc = app.activeDocument;
    if (doc.checkLayer('Solarisation', helpGroupName) != null) return;
    var c = [[0, 0], [26,225], [73,30], [109, 225], [145, 30], [182, 225], [219, 30], [255, 255]];

    group = doc.checkGroup(helpGroupName);
    l = doc.addCurveAdjustment('Solarisation');
    l.setAdjustment(c);
    l.deleteMask();
    l.visible = false;
  } catch (e) {
    log(e);
  }
}

onMakeMemoClick = function()
{
  try {
    var doc = app.activeDocument;
    if (doc.checkLayer('Memo', helpGroupName) != null) return;
    var group = doc.checkGroup(helpGroupName);
    var layer = doc.addLayer('Memo', group, ElementPlacement.INSIDE);
    layer.setStyles(MemoStyles);
    layer.opacity = 66;
  } catch (e) {
    log(e);
  }
}

onMakeSkinCheckerClick = function()
{
  try {
    var doc = app.activeDocument;
    if (doc.checkLayer('Skin Check', helpGroupName) != null) return;
    group = doc.checkGroup(helpGroupName);
    l = doc.addChannelMixer('Skin Checker');
    l.setChannelMixer([-46, 4, 200], 0, true);
    l.deleteMask(l);
    l.visible = false;
  } catch (e) {
    log(e);
  }
}

onMakePerspectiveLinesClick = function()
{
  try {
    var doc = app.activeDocument;
    if (doc.checkLayer('Perspective Lines', helpGroupName) != null) return;
    var group = doc.checkGroup(helpGroupName);
    var v = Math.max(app.activeDocument.width, app.activeDocument.height);
    var a = 15;
    var l;
    var layers = [];

    for (var i = 0; i < 12; ++i) {
      var n = 'Line ' + (i + 1);
      l = doc.drawLine(n, 0, v/2, v, v/2, 0.2);
      l.rotate(i * 15.0);
      l.scale(5);
      layers.push(l);
    }
    var perspective = doc.groupLayers('Perspective Lines', layers);
    perspective.visible = false;
  } catch (e) {
    log(e);
  }
}

onMakeLightnessClick = function()
{
  try {
    var doc = app.activeDocument;
    if (doc.checkLayer('Luminosity Check', helpGroupName) != null) return;
    var group = doc.checkGroup(helpGroupName);
    var l1 = doc.addSolidColorAdjustment('Luminosity', grey50);
    var l2 = doc.addCurveAdjustment('Enhance');
    l1.setBlendingMode('color');
    l2.setAdjustment(Adjustment.scurve(10));
    l1.deleteMask();
    l2.deleteMask();
    group = doc.groupLayers('Luminosity Check', [l1, l2]);
    l2.visible = false;
    group.visible = false;
  } catch (e) {
    log(e);
  }
}

onMatchTonesClick = function()
{
  try {
    var doc = app.activeDocument;
    if (doc.checkLayer('Hue Check', helpGroupName) != null) return;
    var group = doc.checkGroup(helpGroupName);
    var l1 = doc.addSolidColorAdjustment('Hue', grey50);
    var l2 = doc.addHueSaturationAdjustment('Enhance');
    l1.setBlendingMode('luminosity');
    l2.setHueSaturationAdjustment(0, 100, 0);
    l1.deleteMask();
    l2.deleteMask();
    group = doc.groupLayers('Hue Check', [l1, l2]);
    group.visible = false;
  } catch (e) {
    log(e);
  }
}

onMakeSaturationMapClick = function()
{
  try {
    var doc = app.activeDocument;
    if (doc.checkLayer('Saturation Check', helpGroupName) != null) return;
    var group = doc.checkGroup(helpGroupName);
    var l = doc.addSelectiveColorAdjustment('Saturation Check', group);
    var values = {'reds':   [0, 0, 0, -100], 'yellows':  [0, 0, 0, -100],
                  'greens': [0, 0, 0, -100], 'cyans':    [0, 0, 0, -100],
                  'blues':  [0, 0, 0, -100], 'magentas': [0, 0, 0, -100],
                  'whites': [0, 0, 0,  100], 'neutrals': [0, 0, 0, 100],
                  'blacks': [0, 0, 0,  100], 'absolute': true};
    l.setAdjustment(values);
    l.deleteMask();
    l.visible = false;
  } catch (e) {
    log(e);
  }
}

onDeleteAllClick = function()
{
  try {
    var group = app.activeDocument.findGroup(helpGroupName)
    if (group != null) {
      group.remove();
    }
  } catch (e) {
    log(e);
  }
}
