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
  return (isMac()) ? '/' : '\\';
}

addPathSep = function(path)
{
  var s = sep();
  if (path.slice(-1) != s) {
    return path + s;
  }
  return path;
}

importPlugins = function(pluginPath)
{
  try {
    var plugins = [];
    var pluginFolder = new Folder(pluginPath + 'plugins');
    if (pluginFolder != null) {
      var fileList = pluginFolder.getFiles('*.jsx');
      for (var i = 0 ;i < fileList.length; i++) {
        include(fileList[i].fsName);
        var name = removeExt(basename(fileList[i].fsName));
        var info = {'id': '', 'group': 'Plugins', 'title': '',
                    'help': 'User defined plugin.', 'icon': 'img/icon-default.svg'};
        var json = addPathSep(pluginFolder.fsName) + name + '.json';
        f = new File(json);
        if (f.exists) {
          f.open('r');
          var content = f.read();
          f.close();
          info = JSON.parse(content);
        }
        if (info['title'] == '') {
          info['title'] = name;
        }
        if (info['id'] == '') {
          info['id'] = info['title'].replace(' ', '');
        }
        var svg = addPathSep(pluginFolder.fsName) + name + '.svg';
        var f = new File(svg);
        if (f.exists) {
          info['icon'] = '../plugins/' + name + '.svg'
        }
        plugins.push(info);
      }
    }
    return plugins;
  } catch (e) {
    log(e);
    return {};
  }
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
    include(jsxPath + 'styles.jsx');
    include(jsxPath + 'adjustmentlayer.jsx');
    include(jsxPath + 'selection.jsx');
    include(jsxPath + 'atn.jsx');
    include(jsxPath + 'settings.jsx');
    include(jsxPath + 'metadata.jsx');
    include(jsxPath + 'json2.js');

    // tabs
    include(jsxPath + 'retouch.jsx');
    include(jsxPath + 'helpers.jsx');
    include(jsxPath + 'savelayers.jsx');
    include(jsxPath + 'light.jsx');
    include(jsxPath + 'color.jsx');
    include(jsxPath + 'finish.jsx');

    // Plugins
    var plugins = importPlugins(pluginPath);

    settings = new Settings(userDataPath, pluginPath);
    checkAtn(userDataPath, pluginPath, settings);

    return JSON.stringify(plugins);
  } catch (e) {
    log(e);
    return {};
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
