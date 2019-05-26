//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Layer & Group handling
//
//**************************************************************************

LayerSet.prototype.activateMask = ArtLayer.prototype.activateMask = function()
{
  try {
    this.activate();
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
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('UsrM'));
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    var desc1 = executeActionGet(ref1);
    if (desc1.hasKey(cTID('UsrM'))) {
      return true;
    }
  } catch(e) {
  }
  return false;
}

//_addMask = function(hidden)
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
//LayerSet.prototype.addMask = function(h) { _addMask(h); };
//ArtLayer.prototype.addMask = function(h) { _addMask(h); };

LayerSet.prototype.enableMask = ArtLayer.prototype.enableMask = function(enable)
{
  try {
    if (!(this.hasMask(layer))) {
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
