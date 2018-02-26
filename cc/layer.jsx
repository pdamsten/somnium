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

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

findGroup = function(name)
{
  var len = app.activeDocument.layers.length;
  var group = null;
  
  for (var i = len -1; i >= 0; --i) {
    var layer = app.activeDocument.layers[i];
    if (layer.typename == 'LayerSet' && layer.name == name) {
      return layer;
    }
  }
  return null;
}

createGroup = function(name, layer)
{
  if (typeof layer !== 'undefined') {
    app.activeDocument.activeLayer = layer;
  }
  var group = app.activeDocument.layerSets.add();
  group.name = name;
  app.activeDocument.activeLayer = group;
  return group;
}

checkGroup = function(name)
{
  var group = findGroup(name);
  if (group == null) {
    createGroup(name, app.activeDocument.layers[0]);
  }
  app.activeDocument.activeLayer = group;
}

deleteLayerMask = function(layer)
{
  try {
    app.activeDocument.activeLayer = layer;
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Msk '));
    desc1.putReference(cTID('null'), ref1);
    desc1.putBoolean(cTID('MkVs'), false);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
    
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Dlt '), desc1, DialogModes.NO);
  } catch (err) {
     return false; 
  }
  return true;
}
