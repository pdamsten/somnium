//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//  Copyright (c) 2018-2020 by Petri Damstén <petri.damsten@gmail.com>
//
//  This file is part of Somnium.
//
//  Somnium is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  Foobar is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with Somnium.  If not, see <https://www.gnu.org/licenses/>.
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var pluginPath = '';
var settings;

// Load PS DOM classes so we can extend them
if (typeof LayerSet === 'undefined') {
  LayerSet = function() {};
}
if (typeof ArtLayer === 'undefined') {
  ArtLayer = function() {};
}
if (typeof Document === 'undefined') {
  Document = function() {};
}

function include(path)
{
  try {
    $.evalFile(path);
  } catch (e) {
    log(e, path);
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

mkdir = function(dir)
{
  try {
    var folder = Folder(dir);

    if(!folder.exists) {
      folder.create();
    }
  } catch(e) {
    log(e);
    return false;
  }
  return true;
}

function init(path)
{
  try {
    pluginPath = path;
    var jsxPath = addPathSep(pluginPath + 'cc');

    $.evalFile(jsxPath + 'lib/log-basic.jsx');

    var userDataPath = addPathSep(addPathSep(Folder.userData.fsName) + 'somnium');
    mkdir(userDataPath);
    include(jsxPath + 'lib/log.jsx');
    Log.init(userDataPath + 'log.txt');

    // libs
    include(jsxPath + 'lib/util.jsx');
    include(jsxPath + 'lib/layer.jsx');
    include(jsxPath + 'lib/mask.jsx');
    include(jsxPath + 'lib/adjustment.jsx');
    include(jsxPath + 'lib/styles.jsx');
    include(jsxPath + 'lib/adjustmentlayer.jsx');
    include(jsxPath + 'lib/selection.jsx');
    include(jsxPath + 'lib/atn.jsx');
    include(jsxPath + 'lib/settings.jsx');
    include(jsxPath + 'lib/metadata.jsx');

    include(jsxPath + 'libex/json2.js');
    include(jsxPath + 'libex/mozilla.js');
    include(jsxPath + 'libex/polyfill.js');

    // tabs
    include(jsxPath + 'retouch.jsx');
    include(jsxPath + 'helpers.jsx');
    include(jsxPath + 'savelayers.jsx');
    include(jsxPath + 'light.jsx');
    include(jsxPath + 'color.jsx');
    include(jsxPath + 'finish.jsx');

    settings = new Settings(userDataPath, pluginPath);
    Atn.check(userDataPath, pluginPath, settings);

    // Plugins
    var plugins = importPlugins(addPathSep(userDataPath + 'plugins'));

    return JSON.stringify(plugins);
  } catch (e) {
    log(e);
    return '{}';
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
