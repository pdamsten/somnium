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

const settings = require('./settings.js');
const somnium = require('./somnium.js');

module.exports = {
  makeVignette,
  quickDB
}

async function quickDB()
{
  try {
    let dbDlg = {
      'title': 'Quick Dodge and Burn',
      'id': 'quickDB-Dlg',
      'width': 350,
      'height': 500,
      "config": {
        "type": {
          "title": "Strength:",
          "type": "selection",
          "value": 0,
          "values": ["Normal (Soft Light)", "Strong (Vivid Light)"]
        }
      },
      'callback': 'onQuickDBClickOK'
    };
    await settings.loadDlgValues(dbDlg);
    let res = await jdialog.open(dbDlg);
    if (res == 'ok') {
      await settings.saveDlgValues(dbDlg);
      await somnium.runScript('jsx/funcs/onQuickDBClick.jsx');
    }
  } catch (e) {
    console.log(e);
  }
}

async function makeVignette()
{
  try {
    let type = await settings.value('MakeVignette', 'type');
    if (type == 2) {
      let vignetteDlg = {
        'title': 'Vignette',
        'width': 350,
        'height': 500,
        "config": {
          "type": {
            "title": "Style:",
            "type": "selection",
            "value": 0,
            "values": ["Elliptical", "Rectangular"]
          }
        }
      };
      await settings.loadDlgValues(vignetteDlg);
      let res = await jdialog.open(vignetteDlg);
      if (res == 'ok') {
        await settings.saveDlgValues(vignetteDlg);
        await somnium.runScript('jsx/funcs/onMakeVignetteClick.jsx');
      }
    } else {
      await settings.setValue('Vignette-Dlg', 'type', type);
      await somnium.runScript('jsx/funcs/onMakeVignetteClick.jsx');
    }
  } catch (e) {
    console.log(e);
  }
}
