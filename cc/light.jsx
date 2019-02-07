//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish - Light tab code
//
//**************************************************************************

onMakeCookieClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var type = settings.value('MakeCookie', 'type');

    if (type == 0) {
      var c = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, -15), Adjustment.curvePoint(255, 0)];
      l = doc.addCurveAdjustment('Cookie');
      l.move(current, ElementPlacement.PLACEBEFORE);
      l.setAdjustment(c);
      l.setBlendingMode('luminosity');
    } else {
      var c = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, 15), Adjustment.curvePoint(255, 0)];
      l = doc.addCurveAdjustment('Cookie');
      l.move(current, ElementPlacement.PLACEBEFORE);
      l.setAdjustment(c);
      l.invertMask();
      l.setBlendingMode('luminosity');
    }
  } catch (e) {
    log(e);
  }
}

onMakeVignetteClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var type = settings.value('MakeVignette', 'type');
    var p = 0.1;
    var width = app.activeDocument.width.as("px");
    var height = app.activeDocument.height.as("px");
    var c = [height * p, width * p, height - height * p, width - width * p];
    doc.makeSelection('new', type, c, 0.5);
    var c = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, -20),
             Adjustment.curvePoint(255, 0)];
    l = doc.addCurveAdjustment('Vignette');
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.setAdjustment(c);
    l.invertMask();
    l.setMaskFeather(width * 0.1);
    l.setBlendingMode('luminosity');
  } catch (e) {
    log(e);
  }
}

onMakeWashOutClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var c = [Adjustment.curvePoint(0, 5), Adjustment.curvePoint(32, 0),
             Adjustment.curvePoint(224, 0), Adjustment.curvePoint(255, -2.5)];

    l = doc.addCurveAdjustment('Faded / Contrast');
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.setCurveAdjustment(c);
    l.deleteMask();
    l.setBlendingMode('luminosity');
  } catch (e) {
    log(e);
  }
}

onMakeDBClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var type = settings.value('MakeDB', 'type');

    if (type == 1) {
      var l = doc.addLayer('Dodge & Burn');
      l.move(current, ElementPlacement.PLACEBEFORE);
      l.fill('gray');
      l.setBlendingMode('overlay');
      Photoshop.selectTool('burn');
    } else {
      var group = doc.addGroup('Dodge & Burn');
      group.move(current, ElementPlacement.PLACEBEFORE);
      var b = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, -30),
               Adjustment.curvePoint(255, 0)];
      var d = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, 30),
               Adjustment.curvePoint(255, 0)];
      var dl = doc.addCurveAdjustment('Dodge', group);
      var bl = doc.addCurveAdjustment('Burn', group);
      dl.setAdjustment(d);
      bl.setAdjustment(b);
      dl.invertMask();
      bl.invertMask();
      dl.setBlendingMode('luminosity');
      bl.setBlendingMode('luminosity');
      Photoshop.setDefaultColors();
      group.activate();;
      Photoshop.selectTool('brush'); // TODO brush preset?
    }
  } catch (e) {
    log(e);
  }
}

onMakeHighlightClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var l = doc.addSolidColorAdjustment('Hightlight')
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.setAdjustment([255, 255, 255]);
    l.setBlendingMode('soft light');
    l.addMask();
    l.invertMask(l);
  } catch (e) {
    log(e);
  }
}
