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

LayerSet.prototype.activateMask = ArtLayer.prototype.activateMask = function()
{
  try {
    this.activate();
    if (!this.hasMask()) {
      return false;
    }
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Msk '));
    desc1.putReference(cTID('null'), ref1);
    desc1.putBoolean(cTID('MkVs'), false);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false; // No mask
  }
  return true;
}

LayerSet.prototype.hasMask = ArtLayer.prototype.hasMask = function()
{
  try {
    this.activate();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID('Prpr'), sTID("hasUserMask"));
    ref.putEnumerated(sTID("layer"), sTID("ordinal"), sTID("targetEnum"));
    return executeActionGet(ref).getBoolean(sTID("hasUserMask"));
  } catch (e) {
    log(e);
    return false;
  }
  return false;
}

LayerSet.prototype.isMaskEnabled = ArtLayer.prototype.isMaskEnabled = function()
{
  try {
    this.activate();
    if (!this.hasMask()) {
      return false;
    }
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID('Prpr'), sTID("userMaskEnabled"));
    ref.putEnumerated(sTID("layer"), sTID("ordinal"), sTID("targetEnum"));
    return executeActionGet(ref).getBoolean(sTID("userMaskEnabled"));
  } catch (e) {
    log(e);
    return false;
  }
  return false;
}

LayerSet.prototype.enableMask = ArtLayer.prototype.enableMask = function(enable)
{
  try {
    this.activate();
    if (!this.hasMask()) {
      return false;
    }
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    var ref1 = new ActionReference();

    ref1.putEnumerated(sTID("layer"), sTID("ordinal"), sTID("targetEnum"));
    desc1.putReference(sTID("null"), ref1);
    desc2.putBoolean(sTID("userMaskEnabled"), enable);
    desc1.putObject(sTID("to"), stringIDToTypeID("layer"), desc2);
    executeAction(sTID("set"), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

LayerSet.prototype.toggleMaskEnabled = ArtLayer.prototype.toggleMaskEnabled = function(enable)
{
  try {
    this.activate();
    if (!this.hasMask()) {
      return false;
    }
    this.enableMask(!this.isMaskEnabled());
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

LayerSet.prototype.showMask = ArtLayer.prototype.showMask = function(show)
{
  try {
    if (!this.activateMask()) {
      return false;
    }
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(sTID("channel"), sTID("ordinal"), sTID("targetEnum"));
    desc1.putReference(sTID("null"), ref1);
    desc1.putBoolean(sTID("makeVisible"), show);
    executeAction(sTID("select"), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

LayerSet.prototype.showMaskOverlay = ArtLayer.prototype.showMaskOverlay = function(show)
{
  try {
    if (!this.activateMask()) {
      return false;
    }
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    var list1 = new ActionList();
    ref1.putEnumerated(sTID("channel"), sTID("ordinal"), sTID("targetEnum"));
    list1.putReference(ref1);
    desc1.putList(sTID("null"), list1);
    executeAction(sTID("show"), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

LayerSet.prototype.addMask = ArtLayer.prototype.addMask = function(hidden)
{
  try {
    hidden = (typeof hidden === 'undefined') ? false : hidden;
    this.activate();
    this.deleteMask();
    var desc1 = new ActionDescriptor();
    desc1.putClass(cTID('Nw  '), cTID('Chnl'));
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Msk '));
    desc1.putReference(cTID('At  '), ref1);
    if (app.activeDocument.hasSelection()) {
      var type = (hidden) ? cTID('HdSl') : cTID('RvlS');
    } else {
      var type = (hidden) ? cTID('HdAl') : cTID('RvlA');
    }
    desc1.putEnumerated(cTID('Usng'), cTID('UsrM'), type);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false; // No mask
  }
}

LayerSet.prototype.contractMask = ArtLayer.prototype.contractMask = function(radius)
{
  this.minMaxMask('minimum', radius);
}

LayerSet.prototype.expandMask = ArtLayer.prototype.expandMask = function(radius)
{
  this.minMaxMask('maximum', radius);
}

LayerSet.prototype.minMaxMask = ArtLayer.prototype.minMaxMask = function(type, radius)
{
  try {
    if (radius == null) {
      radius = 1.0;
      dm = DialogModes.ALL;
    } else {
      dm = DialogModes.NO;
    }
    var id = sTID(type);
    var idradius = sTID("radius");
    var idpixelsUnit = sTID("pixelsUnit");
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(idradius, idpixelsUnit, radius);
    var idpreserveShape = sTID("preserveShape");
    var idroundness = sTID("roundness");
    desc1.putEnumerated(idpreserveShape, idpreserveShape, idroundness);
    executeAction(id, desc1, dm);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

LayerSet.prototype.enableMask = ArtLayer.prototype.enableMask = function(enable)
{
  try {
    if (!(this.hasMask())) {
      return false;
    }
    this.activate();
    var idsetd = cTID("setd");
    var desc9 = new ActionDescriptor();
    var idnull = cTID("null");
    var ref4 = new ActionReference();
    var idLyr = cTID("Lyr ");
    var idOrdn = cTID("Ordn");
    var idTrgt = cTID("Trgt");
    ref4.putEnumerated(idLyr, idOrdn, idTrgt);
    desc9.putReference(idnull, ref4);
    var idT = cTID("T   ");
    var desc10 = new ActionDescriptor();
    var idUsrM = cTID("UsrM");
    desc10.putBoolean(idUsrM, enable);
    var idLyr = cTID("Lyr ");
    desc9.putObject(idT, idLyr, desc10);
    executeAction(idsetd, desc9, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false; // No mask
  }
}

LayerSet.prototype.deleteMask = ArtLayer.prototype.deleteMask = function()
{
  try {
    if (!(this.hasMask())) {
      return false;
    }
    this.activate();
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
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

LayerSet.prototype.setMaskFeather = ArtLayer.prototype.setMaskFeather = function(feather)
{
  try {
    this.activate();
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(sTID("userMaskFeather"), cTID('#Pxl'), feather);
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
return true;
}

LayerSet.prototype.setMaskDensity = ArtLayer.prototype.setMaskDensity = function(density)
{
  try {
    this.activate();
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(sTID("userMaskDensity"), cTID('#Prc'), density);
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
return true;
}

LayerSet.prototype.invertMask = ArtLayer.prototype.invertMask = function()
{
  try {
    this.activate();
    this.activateMask();
    executeAction(cTID('Invr'), undefined, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

LayerSet.prototype.maskToSelection = ArtLayer.prototype.maskToSelection = function()
{
  try {
    this.activate();
    this.activateMask();
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID('Chnl'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('T   '), ref2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

LayerSet.prototype.saveMask = ArtLayer.prototype.saveMask = function(name)
{
  try {
    this.activate();
    this.maskToSelection();
    app.activeDocument.saveSelection(name);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

LayerSet.prototype.loadMask = ArtLayer.prototype.loadMask = function(name)
{
  try {
    this.activate();
    this.deleteMask();
    app.activeDocument.loadSelection(name);
    this.addMask();
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}
