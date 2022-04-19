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

TestBench = (function() {

var userPath = Folder('~').fsName;
var TEST_FILE = '/Volumes/Volume1/tmp/20220113-101253-00320.psb';
//var TEST_FILE = userPath + '/tmp/test.psb';

return { // public:

title: 'Test Bench',
help: 'Time various tasks in Photoshop.',

openPSB: function()
{
  var f = new File(TEST_FILE);
  var bench = app.open(f);
},

savePSB: function()
{
  var filename = Path.uniqueFilename(userPath + '/tmp/', 'test_bench', '.psb');
  app.activeDocument.saveAsPSB(filename);
},

surfaceBlur: function()
{
  app.activeDocument.activateLayer('first');
  app.activeDocument.stampCurrentAndBelow('Surface Blur');
  app.activeDocument.activeLayer.applySurfaceBlur(20, 20, false);
  app.activeDocument.activeLayer.visible = false;
},

crop: function()
{
  var rc = [200, 200, 3000, 3000];
  app.activeDocument.crop(rc);
},

onClick: function()
{
  try {
    var img = new File(TEST_FILE);
    if (img.exists === true) {
      logTiming('Open PSB', TestBench.openPSB, true);
      logTiming('Save PSB', TestBench.savePSB, true);
      logTiming('Save layers', onSaveLayersClick, true);
      logTiming('Surface Blur', TestBench.surfaceBlur, true);
      logTiming('Stamp to smart object', onSmartFromUnderClick, true);
      logTiming('Highpass Sharpening', onHighPassSharpeningClick, true);
      logTiming('Make all help layers', onMakeAllClick, true);
      logTiming('Crop', TestBench.crop, true);
    } else {
      alert('Test file does not exist: ' + TEST_FILE);
    }
  } catch (e) {
    log(e);
  }
},

};})();
