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
    include(jsxPath + 'mask.jsx');
    include(jsxPath + 'adjustment.jsx');
    include(jsxPath + 'adjustmentlayer.jsx');
    include(jsxPath + 'selection.jsx');
    // tabs
    include(jsxPath + 'retouch.jsx');
    include(jsxPath + 'helpers.jsx');
    include(jsxPath + 'savelayers.jsx');
    include(jsxPath + 'light.jsx');
    include(jsxPath + 'color.jsx');
    include(jsxPath + 'finish.jsx');
  } catch (e) {
    log(e);
  }
}

function onLogoClick()
{
  openURL('http://petridamsten.com/');
}

onColorPickerClick = function(color)
{
  try {
    var rgb = color.substring(4, color.length - 1).replace(/ /g, '').split(',');
    var newColor = $.colorPicker(rgb[0] << 16 | rgb[1] << 8 | rgb[2]);
    var r = newColor >> 16;
    var g = newColor >> 8 & 0xFF;
    var b = newColor & 0xFF;
    var s = 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
    return s;
  } catch (e) {
    log(e);
  }
}

msg = function(s)
{
  alert(s);
}
