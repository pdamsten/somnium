//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@iki.fi>
//
//   This program is free software; you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation; either version 2 of the License, or
//   (at your option) any later version.
//
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License
//   along with this program; if not, write to the
//   Free Software Foundation, Inc.,
//   51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
//
//**************************************************************************

function include(path) 
{
  try {
    $.evalFile(path);
  } catch (e) {
    alert("Exception:" + e);
  }
}

function init(jsxPath) 
{
  include(jsxPath + 'util.jsx');
  include(jsxPath + 'adjustment.jsx');
  include(jsxPath + 'layer.jsx');
}

function checkLayerGroup()
{
  var len = app.activeDocument.layers.length;
  var group = null;
  
  for (var i = len -1; i >= 0; --i) {
    var layer = app.activeDocument.layers[i];
    if (layer.typename == 'LayerSet' && layer.name == 'Help Layers') {
      group = layer;
      break;
    }
  }
  if (group == null) {
    app.activeDocument.activeLayer = app.activeDocument.layers[0];
    group = app.activeDocument.layerSets.add();
    group.name = 'Help Layers';
  }
  app.activeDocument.activeLayer = group;
}

function onMakeAllClick()
{
  try {
    onMakeSolarisationClick();
  } catch (err) {
    alert(err.message);
  }
}

function onMakeSolarisationClick()
{
  var c = [[0, 0], [26,225], [73,30], [109, 225], [145, 30], [182, 225], [219, 30], [255, 255]];

  checkLayerGroup();
  l = createCurveAdjustment();
  setCurveAdjustment(l, c);
  deleteLayerMask(l);
  l.name = 'Solarisation';
  l.visible = false;
}

function onLogoClick()
{
  openURL('http://petridamsten.com/');
}
