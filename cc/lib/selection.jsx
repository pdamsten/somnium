//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Selection handling
//
//**************************************************************************

Document.prototype.hasSelection = function()
{
  try {
    return (this.selection.bounds) ? true : false;
  } catch(e) {
    return false;
  }
}

Document.prototype.makeSelection = function(mode, type, coords, feather)
{
  var modes = {'new': cTID('setd'), 'add': sTID('addTo'),
               'subtract': sTID('subtractFrom'), 'intersect': sTID('interfaceWhite')};
  var types = [cTID('Elps'), cTID('Rctn')];

  try {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Top '), cTID('#Pxl'), coords[0]);
    desc2.putUnitDouble(cTID('Left'), cTID('#Pxl'), coords[1]);
    desc2.putUnitDouble(cTID('Btom'), cTID('#Pxl'), coords[2]);
    desc2.putUnitDouble(cTID('Rght'), cTID('#Pxl'), coords[3]);
    desc1.putObject(cTID('T   '), types[type], desc2);
    desc1.putUnitDouble(cTID('Fthr'), cTID('#Pxl'), feather);
    desc1.putBoolean(cTID('AntA'), true);
    executeAction(modes[mode], desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

Document.prototype.clearSelection = function()
{
  try {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    desc1.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('None'));
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

Document.prototype.selectLayer = function(layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Trsp'));
    desc1.putReference(cTID('T   '), ref2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

Document.prototype.inverseSelection = function() {
  try {
    executeAction(cTID('Invs'), undefined, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

Document.prototype.expandSelection = function(pixels) {
  try {
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(cTID('By  '), cTID('#Pxl'), pixels);
    desc1.putBoolean(sTID("selectionModifyEffectAtCanvasBounds"), false);
    executeAction(cTID('Expn'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}
