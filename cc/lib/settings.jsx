//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   settings class
//
//**************************************************************************

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
    var f = File(this.mainPath + 'config.json');
    f.open('r');
    var content = f.read();
    f.close();
    this.config = JSON.parse(content);
  } catch (e) {
  }
}

Settings.prototype.saveConfig = function()
{
  try {
    var f = File(this.mainPath + 'config.json');
    f.open('w');
    f.write(JSON.stringify(this.config));
    f.close();
  } catch (e) {
    log(e);
  }
}