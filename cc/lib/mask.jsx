//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Layer & Group handling
//
//**************************************************************************

ArtLayer.prototype.hasMask = function()
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

ArtLayer.prototype.addMask = function(hidden)
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
    if (hasSelection()) {
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

ArtLayer.prototype.enableMask = function(enable)
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

ArtLayer.prototype.deleteMask = function()
{
  try {
    if (!(hasLayerMask(layer))) {
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

ArtLayer.prototype.setMaskFeather = function(feather)
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

ArtLayer.prototype.setMaskDensity = function(density)
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

ArtLayer.prototype.invertMask = function()
{
  try {
    this.activateMask(layer);
    executeAction(cTID('Invr'), undefined, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}
