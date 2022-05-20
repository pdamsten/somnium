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

const app = require("photoshop").app;
const somnium = require('../modules/somnium.js');
const settings = require('../modules/settings.js');
const jdialog = require('../modules/jdialog.js');


const title = 'Include Setup Items';
const help = 'Import items for making setup images.';

module.exports = {
  title,
  help,
  onClick
}

Object.isDictionary = function()
{
  return (typeof this === 'object') && (this !== null) &&
         !(this instanceof Array) && !(this instanceof Date);
}

Object.deepCopy = function(src)
{
  var dest = {};

  for (var prop in src) {
    if (src.hasOwnProperty(prop)) {
      if (Object.isDictionary(src[prop])) {
        dest[prop] = Object.deepCopy(src[prop]);
      } else {
        dest[prop] = src[prop];
      }
    }
  }
  return dest;
}

async function onClick()
{
  const LIGHTS = 5;
  let light = {
    "header": {
      "title": "Light 1",
      "type": "label",
    },
    "role": {
      "title": "Role:",
      "type": "selection",
      "value": "0",
      "values": ["None", "Key Light", "Rim Light", "Accent Light", "Hair Light", "Fill Light",
                 "Background Light"]
    },
    "flash": {
      "title": "Flash:",
      "type": "selection",
      "value": "0",
      "values": ["Godox AD200", "Godox AD600BM", "Godox QS600", "Godox QS300",
                 "Yongnuo YN 560", "Yongnuo YN 565EX", "Yongnuo YN 568EX",
                 "Elinchrom RX4", "Elinchrom RX2", "Natural Light"]
    },
    "modifier": {
      "title": "Modifier:",
      "type": "selection",
      "value": "0",
      "values": ["18cm Reflector", "90cm Octabox",
                 "120cm Octabox", "150cm Octabox",
                 "140cm Stripbox", "40cm Beauty Dish", "60x60cm Softbox",
                 "110cm Shoot Through Umbrella", "90cm Reflective Umbrella",
                 "Fresnel Head", "Fresnel Lens", "Snoot", "15cm bulb", "Gobo Holder", "Cloudy Sky", "Blue Sky", "None"]
    },
    "accessory": {
      "title": "Accessory:",
      "type": "selection",
      "value": "0",
      "values": ["None", "with Grid", "with Diffusor", "with White Wall", "with V-Flat",
          "without Diffusor", "without Outer Diffusor"]
    },
    "power": {
      "title": "Power:",
      "type": "pixelsize",
    },
    "gel": {
      "title": "Gel:",
      "type": "selection",
      "value": "0",
      "values": ["None", "#23 Orange", "#26 Light Red",
                 "102 Primary Red", "106 Light Scarlet",
                 "201 Deep Purple Rose", "206 Medium Purple Rose",
                 "404 Golden Amber", "405 Light Amber",
                 "501 Deep Yellow", "503 Yellow",
                 "603 Medium Green", "6001 Dark Green",
                 "8002 Deep Blue", "806 Light Blue"]
    }
  };
  let lightDlg = {
    'title': 'Select Lights',
    'width': 350,
    'height': 500,
    "items": {
      "stand": {
        "title": "Stand:",
        "type": "selection",
        "value": "0",
        "values": ["None", "Gitzo GT2542T & RRS BH-30", "Manfrotto 055XPROB & 498RC2",
                   "Manfrotto 055XPROB & 327RC2", "Fotometal M & Manfrotto MHXPRO-3W"]
      },
      "remote": {
        "title": "Remote:",
        "type": "selection",
        "value": "0",
        "values": ["None", "Aodelan Pebble", "Camranger", "Hähnel Giga T Pro II",
                   "Nonbrand wire remote", "ControlMyCamera iPad app", "Yongnuo YN-622N & YN-622-TX"]
      },
      "trigger": {
        "title": "Trigger:",
        "type": "selection",
        "value": "0",
        "values": ["Godox Xpro-N", "Godox X2T-N", "Elinchrom Skyport Speed", "Godox XT16", "None"]
      },
      "tethering": {
        "title": "Tethering:",
        "type": "selection",
        "value": "0",
        "values": ["None", "QDslrDashboard + Ubuntu", "QDslrDashboard + iPad", "Lightroom"]
      }
    }
  };
  // multiply data for 5 lights
  for (var i = 0; i < LIGHTS; ++i) {
    light['header']['title'] = 'Light ' + (i + 1);
    for (key in light) {
      lightDlg['items'][key + (i + 1)] = Object.deepCopy(light[key]);
    }
  }
  let res = await jdialog.open(lightDlg);
  console.log(res);
  if (res == 'ok') {
    await settings.saveDlgValues(lightDlg);
    await somnium.runScript('plugins/SetupItems.jsx');
  }
}
