//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish - Light tab code
//
//**************************************************************************

onMakeCookieClick = function(type)
{
  var group = checkGroup('Light', 'Finish', 'Help Layers');
  if (type == 'darken') {
    var c = [curvePoint(0, 0), curvePoint(128, -15), curvePoint(255, 0)];
    l = createCurveAdjustment('Cookie', group);
    setCurveAdjustment(l, c);
  } else {
    var c = [curvePoint(0, 0), curvePoint(128, 15), curvePoint(255, 0)];
    l = createCurveAdjustment('Cookie', group);
    setCurveAdjustment(l, c);
    invertLayerMask(l);
    setLayerBlendingMode(l, 'luminosity');
  }
}

onMakeVignetteClick = function(type)
{
  try {
    var group = checkGroup('Light', 'Finish', 'Help Layers');
    var p = 0.1;
    var c = [app.activeDocument.height * p, app.activeDocument.width * p,
             app.activeDocument.height - app.activeDocument.height * p,
             app.activeDocument.width - app.activeDocument.width * p];
    makeSelection('new', type, c, 0.5);
    var c = [curvePoint(0, 0), curvePoint(128, -20), curvePoint(255, 0)];
    l = createCurveAdjustment('Vignette', group);
    setCurveAdjustment(l, c);
    invertLayerMask(l);
    setLayerMaskFeather(l, app.activeDocument.width * 0.1);
    setLayerBlendingMode(l, 'luminosity');
  } catch (e) {
    log(e);
  }
}

onWashOutClick = function()
{
  var group = checkGroup('Light', 'Finish', 'Help Layers');
  var c = [curvePoint(0, 5), curvePoint(32, 0), curvePoint(224, 0), curvePoint(255, -2.5)];

  l = createCurveAdjustment('Wash Out', group);
  setCurveAdjustment(l, c);
  deleteLayerMask(l);
  setLayerBlendingMode(l, 'luminosity');
}

onMakeDBCurves = function()
{
  var group = checkGroup('Light', 'Finish', 'Help Layers');
}

onMakeDBGray = function()
{
  var group = checkGroup('Light', 'Finish', 'Help Layers');
}

onHighlight = function()
{
  var group = checkGroup('Light', 'Finish', 'Help Layers');
}
