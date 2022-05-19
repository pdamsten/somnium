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

Settings = function(path, pluginPath)
{
  this.config = {};
  this.mainPath = path;

  this.jsonFile = pluginPath + 'ui/js/settings.json';
  var f = File(this.jsonFile);
  f.open('r');
  var content = f.read();
  f.close();
  this.constant = JSON.parse(content.substring(15));
  this.loadConfig();
}

Settings.prototype.getConfig = function(group)
{
  return this.config[group]['config'];
}

Settings.prototype.value = function(group, key, value)
{
  if (value == undefined) {
    // Get value
    try {
      return this.config[group]['config'][key]['value'];
    } catch (e) {
    }
    try {
      // Default value
      return this.constant[group]['config'][key]['value'];
    } catch (e) {
    }
    return '';
  } else {
    // Set value
    if (!(group in this.config)) {
      this.config[group] = {};
    }
    if (!('config' in this.config[group])) {
      this.config[group]['config'] = {};
    }
    if (!(key in this.config[group]['config'])) {
      this.config[group]['config'][key] = {};
    }
    this.config[group]['config'][key]['value'] = value;
    this.saveConfig();
  }
}

Settings.prototype.saveDlgValues = function(dlgData)
{
  for (var key in dlgData['items']) {
    this.value(dlgData['title'] + '-Dlg', key, dlgData['items'][key]['value']);
  }
}

Settings.prototype.loadDlgValues = function(dlgData)
{
  for (var key in dlgData['items']) {
    dlgData['items'][key]['value'] = this.value(dlgData['title'] + '-Dlg', key);
  }
}

Settings.prototype.constantData = function()
{
  return this.constant;
}

Settings.prototype.version = function()
{
  return fileVersion(this.jsonFile);
}

Settings.prototype.loadConfig = function()
{
  try {
    this.config = {};
    var f = File(this.mainPath + 'config.json');
    f.encoding = "BINARY"; // For proper line ending
    f.open('r');
    var content = f.read();
    f.close();
    if (typeof content == 'string' && content != '') {
      this.config = JSON.parse(content);
    }
  } catch (e) {
    log(e);
  }
}

Settings.prototype.saveConfig = function()
{
  try {
    var f = File(this.mainPath + 'config.json');
    f.encoding = "BINARY"; // For proper line ending
    f.open('w');
    f.write(JSON.stringify(this.config, null, 2));
    f.close();
  } catch (e) {
    log(e);
  }
}
