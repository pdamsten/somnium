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
    alert("Exception:" + e);
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
    onMakeSolarisationClick();
  } catch (err) {
    alert(err.message);
  }
}

function onMakeSolarisationClick()
{
  var c = [[0, 0], [26,225], [73,30], [109, 225], [145, 30], [182, 225], [219, 30], [255, 255]];

  checkGroup(helpGroupName);
  l = createCurveAdjustment('Solarisation');
  setCurveAdjustment(l, c);
  deleteLayerMask(l);
  l.visible = false;
}

function onMemoClick()
{
  drawLine('Line 1', 0, 0, 2000, 2000, 4);
}

function onMakePerspectiveLinesClick()
{
  drawLine('Line 1', 0, 0, 2000, 2000, 4);
}

function onLogoClick()
{
  openURL('http://petridamsten.com/');
}
