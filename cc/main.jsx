//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Main file for cc code
//
//**************************************************************************

var pluginPath = '';
var settings;

function include(path)
{
  try {
    $.evalFile(path);
  } catch (e) {
    log(e);
  }
}

isMac = function()
{
  return ($.os.toLowerCase().indexOf('mac') >= 0);
}

sep = function()
{
  return (isMac) ? '/' : '\\';
}

addPathSep = function(path)
{
  var s = sep();
  if (path.slice(-1) != s) {
    return path + s;
  }
  return path;
}

function init(path)
{
  try {
    pluginPath = path;

    var jsxPath = addPathSep(pluginPath + 'cc');
    var userDataPath = addPathSep(addPathSep(Folder.userData.fsName) + 'somnium');

    include(jsxPath + 'util.jsx');
    mkdir(userDataPath);

    include(jsxPath + 'log.jsx');
    initLog(userDataPath + 'log.txt');

    // libs
    include(jsxPath + 'layer.jsx');
    include(jsxPath + 'mask.jsx');
    include(jsxPath + 'adjustment.jsx');
    include(jsxPath + 'adjustmentlayer.jsx');
    include(jsxPath + 'selection.jsx');
    include(jsxPath + 'atn.jsx');
    include(jsxPath + 'settings.jsx');
    include(jsxPath + 'json2.js');

    // tabs
    include(jsxPath + 'retouch.jsx');
    include(jsxPath + 'helpers.jsx');
    include(jsxPath + 'savelayers.jsx');
    include(jsxPath + 'light.jsx');
    include(jsxPath + 'color.jsx');
    include(jsxPath + 'finish.jsx');

    settings = new Settings(userDataPath, pluginPath);
    checkAtn(userDataPath, pluginPath, settings);
  } catch (e) {
    //alert(e);
    log(e);
  }
}

function onLogoClick()
{
  openURL('http://petridamsten.com/');
}

isDebug = function()
{
  var d = new File(pluginPath + 'debug.sh');
  if (d.exists) { // We are in developing environment
    return true;
  }
  return false;
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
  return 'rgb(0,0,0)'
}

onBrowseFolderClick = function(title, path)
{
  try {
    var save = new Folder(File(path).fsName);
    var folder = save.selectDlg(title, '', false);
    return folder;
  } catch (e) {
    log(e);
  }
  return addPathSep('~');
}
