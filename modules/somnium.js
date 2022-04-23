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

const app = require("photoshop").app;
const { entrypoints } = require("uxp");
const batchPlay = require("photoshop").action.batchPlay;
const fs = require("uxp").storage.localFileSystem;
const core = require("photoshop").core;

module.exports = {
  runScript
}

async function _ScriptRun(executionControl, descriptor) {
  jsxFile = descriptor;
  let pluginFolder = await fs.getPluginFolder();
  try {
    let jsxFileObject = await pluginFolder.getEntry(jsxFile);
    var filetoken = await fs.createSessionToken(jsxFileObject);
  } catch (e) {
    app.showAlert("File Can't be found!");
  }
  return await batchPlay(
      [
         {
            "_obj": "AdobeScriptAutomation Scripts",
            "javaScript": {
               "_path": filetoken,
               "_kind": "local"
            },
            "javaScriptMessage": "undefined",
            "_isCommand": true,
         }
      ], {
  });
}

async function runScript(script)
{
  core.executeAsModal(_ScriptRun, {"commandName": "Run JSX Script", "descriptor": script});
}
