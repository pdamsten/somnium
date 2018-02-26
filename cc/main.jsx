//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Main file for cc code
//
//**************************************************************************

function log(msg)
{
  alert(msg);
}

function include(path)
{
  try {
    $.evalFile(path);
  } catch (e) {
    log(e.message);
  }
}

function init(jsxPath)
{
  include(jsxPath + 'util.jsx');
  include(jsxPath + 'adjustment.jsx');
  include(jsxPath + 'layer.jsx');
}

var helpGroupName = 'Help Layers';

function onMakeAllClick()
{
  try {
    //onMakeSolarisationClick();
    onMakePerspectiveLinesClick();
    //onMemoClick();
  } catch (err) {
    log(err.message);
  }
}

function onMakeSolarisationClick()
{
  var c = [[0, 0], [26,225], [73,30], [109, 225], [145, 30], [182, 225], [219, 30], [255, 255]];

  group = checkGroup(helpGroupName);
  l = createCurveAdjustment('Solarisation', group);
  setCurveAdjustment(l, c);
  deleteLayerMask(l);
  l.visible = false;
}

function onMemoClick()
{
  group = checkGroup(helpGroupName);
  createLayer('Memo', group);
}

function onMakePerspectiveLinesClick()
{
  var v = Math.max(app.activeDocument.width, app.activeDocument.height);
  var a = 15;
  var l;
  var group = checkGroup(helpGroupName);
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

function onLogoClick()
{
  openURL('http://petridamsten.com/');
}
