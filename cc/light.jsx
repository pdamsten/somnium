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
    var current = app.activeDocument.activeLayer;
    var type = settings.value('MakeCookie', 'type');

    if (type == 0) {
      var c = [curvePoint(0, 0), curvePoint(128, -15), curvePoint(255, 0)];
      l = createCurveAdjustment('Cookie');
      l.move(current, ElementPlacement.PLACEBEFORE);
      setCurveAdjustment(l, c);
    } else {
      var c = [curvePoint(0, 0), curvePoint(128, 15), curvePoint(255, 0)];
      l = createCurveAdjustment('Cookie');
      l.move(current, ElementPlacement.PLACEBEFORE);
      setCurveAdjustment(l, c);
      invertLayerMask(l);
      setLayerBlendingMode(l, 'luminosity');
    }
  } catch (e) {
    log(e);
  }
}

onMakeVignetteClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;
    var type = settings.value('MakeVignette', 'type');
    var p = 0.1;
    var width = app.activeDocument.width.as("px");
    var height = app.activeDocument.height.as("px");
    var c = [height * p, width * p, height - height * p, width - width * p];
    makeSelection('new', type, c, 0.5);
    var c = [curvePoint(0, 0), curvePoint(128, -20), curvePoint(255, 0)];
    l = createCurveAdjustment('Vignette');
    l.move(current, ElementPlacement.PLACEBEFORE);
    setCurveAdjustment(l, c);
    invertLayerMask(l);
    setLayerMaskFeather(l, width * 0.1);
    setLayerBlendingMode(l, 'luminosity');
  } catch (e) {
    log(e);
  }
}

onMakeWashOutClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;
    var c = [curvePoint(0, 5), curvePoint(32, 0), curvePoint(224, 0), curvePoint(255, -2.5)];

    l = createCurveAdjustment('Faded / Contrast');
    l.move(current, ElementPlacement.PLACEBEFORE);
    setCurveAdjustment(l, c);
    deleteLayerMask(l);
    setLayerBlendingMode(l, 'luminosity');
  } catch (e) {
    log(e);
  }
}

onMakeDBClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;
    var type = settings.value('MakeDB', 'type');

    if (type == 1) {
      var l = createLayer('Dodge & Burn');
      l.move(current, ElementPlacement.PLACEBEFORE);
      fillLayer(l, 'gray');
      setLayerBlendingMode(l, 'overlay');
      selectTool('burn');
    } else {
      var group = createGroup('Dodge & Burn');
      group.move(current, ElementPlacement.PLACEBEFORE);
      var b = [curvePoint(0, 0), curvePoint(128, -30), curvePoint(255, 0)];
      var d = [curvePoint(0, 0), curvePoint(128, 30), curvePoint(255, 0)];
      var dl = createCurveAdjustment('Dodge', group);
      var bl = createCurveAdjustment('Burn', group);
      setCurveAdjustment(dl, d);
      setCurveAdjustment(bl, b);
      invertLayerMask(dl);
      invertLayerMask(bl);
      setLayerBlendingMode(dl, 'luminosity');
      setLayerBlendingMode(bl, 'luminosity');
      setDefaultColors();
      selectTool('brush'); // TODO brush preset?
    }
  } catch (e) {
    log(e);
  }
}

onMakeHighlightClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;
    var l = createSolidColorAdjustment('Hightlight')
    l.move(current, ElementPlacement.PLACEBEFORE);
    setSolidColorAdjustment(l, [255, 255, 255]);
    setLayerBlendingMode(l, 'softLight');
    addLayerMask(l);
    invertLayerMask(l);
  } catch (e) {
    log(e);
  }
}
