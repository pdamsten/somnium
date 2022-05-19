//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//  Copyright (c) 2022 by Petri Damstén <petri.damsten@gmail.com>
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

const fs = require("uxp").storage.localFileSystem;

module.exports = {
  value,
  setValue,
  saveDlgValues,
  loadDlgValues
}

async function readConfig()
{
  let conf = {};
  try {
    let f = await fs.getDataFolder();
    let jf = await f.getEntry('config.json');
    let s = await jf.read();
    conf = JSON.parse(s);
  } catch (e) {
  }
  let f = await fs.getPluginFolder();
  let jf = await f.getEntry('ui/js/settings.json');
  let s = await jf.read();
  let defs = JSON.parse(s.substring(15));
  return Object.assign(defs, conf);
}

async function writeConfig(values)
{
  let f = await fs.getDataFolder();
  let jf = await f.createFile('config.json', {overwrite: true});
  await jf.write(JSON.stringify(values, null, 2));
}

async function value(group, key, type)
{
  let values = await readConfig();

  if (type != undefined) {
    type = '-' + type;
  } else {
    type = '';
  }
  return values[group]['config'][key]['value' + type];
}

async function setValue(group, key, value, type)
{
  let values = await readConfig();
  let arr;
  let write = false;

  if (Array.isArray(group)) {
    arr = group;
  } else {
    arr = [[group, key, value, type]];
  }

  for (let i = 0; i < arr.length; ++i) {
    [group, key, value, type] = arr[i];
    console.log('x-x', group, key, value, type);

    if (!(group in values)) {
      values[group] = {};
    }
    if (!('config' in values[group])) {
      values[group]['config'] = {};
    }
    if (!(key in values[group]['config'])) {
      values[group]['config'][key] = {};
    }
    if (type != undefined) {
      type = '-' + type;
    } else {
      type = '';
    }
    if (values[group]['config'][key]['value' + type] != value) {
      console.log('a-x', group, key, value, type);
      values[group]['config'][key]['value' + type] = value;
      write = true;
    }
  }
  if (write) {
    console.log('writeConfig');
    await writeConfig(values);
  }
}

async function saveDlgValues(dlgData)
{
  let id = dlgData['title'].replace(' ', '');
  let arr = [];

  for (let key in dlgData['items']) {
    arr.push([id + '-Dlg', key, dlgData['items'][key]['value']]);
    if ('value-string' in dlgData['items'][key]) {
      arr.push([id + '-Dlg', key, dlgData['items'][key]['value-string'], 'string']);
    }
  }
  setValue(arr);
}

async function loadDlgValues(dlgData)
{
  let id = dlgData['title'].replace(' ', '');

  for (let key in dlgData['items']) {
    dlgData['items'][key]['value'] = value(id + '-Dlg', key);
  }
}
