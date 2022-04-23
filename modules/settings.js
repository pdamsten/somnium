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
  value
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
  await jf.write(JSON.stringify(values));
}

async function value(group, key, value)
{
  let values = await readConfig();

  if (value == undefined) {
    return values[group]['config'][key]['value'];
  } else {
    // Set value
    if (!(group in values)) {
      values[group] = {};
    }
    if (!('config' in values[group])) {
      values[group]['config'] = {};
    }
    if (!(key in values[group]['config'])) {
      values[group]['config'][key] = {};
    }
    if (values[group]['config'][key]['value'] != value) {
      values[group]['config'][key]['value'] = value;
      writeConfig(values);
    }
  }
}
