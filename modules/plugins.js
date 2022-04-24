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
const path = require('./path.js');

module.exports = {
  load
}

async function load()
{
  let plugins = [];
  let mainFolder = await fs.getPluginFolder();
  let pluginFolder = await mainFolder.getEntry('plugins');
  const entries = await pluginFolder.getEntries();
  const fileList = entries.filter(entry => entry.nativePath.endsWith('.js'));

  for (let i = 0 ;i < fileList.length; i++) {
    const p = '../' + fileList[i].nativePath.replace(mainFolder.nativePath, '');
    const plugin = require(p);
    const name = path.removeExt(path.basename(fileList[i].nativePath));
    let info = {'id': name, 'group': 'Plugins', 'title': '',
                'help': 'User defined plugin.', 'icon': '',
                'call': name + '.onClick'};
    if (plugin) {
      if (plugin.title) {
        info['title'] = plugin.title;
      }
      if (plugin.help) {
        info['help'] = plugin.help;
      }
      let svg = '';
      if (plugin.icon) {
        svg = 'plugin/' + plugin.icon;
      } else {
        svg = 'plugin/' + name + '.svg';
      }
      try {
        let e = await pluginFolder.getEntry(svg);
        info['icon'] = svg;
      } catch(e) {
        info['icon'] = 'ui/img/icon-default.svg';
      }
      plugins.push(info);
    }
  }
  return plugins;
}
