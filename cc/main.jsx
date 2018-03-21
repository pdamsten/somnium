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
    include(jsxPath + 'selection.jsx');
    // tabs
    include(jsxPath + 'retouch.jsx');
    include(jsxPath + 'helpers.jsx');
    include(jsxPath + 'savelayers.jsx');
    include(jsxPath + 'light.jsx');
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
