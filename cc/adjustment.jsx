//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Adjustment layer handling
//
//**************************************************************************

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

createCurveAdjustment = function(name)
{
  try {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc2.putObject(cTID('Type'), cTID('Crvs'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (err) {
    alert(err.message);
    return null;
  }
}

setCurveAdjustment = function(layer, data)
{
  try {
    app.activeDocument.activeLayer = layer;
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var list1 = new ActionList();
    var desc3 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Cmps'));
    desc3.putReference(cTID('Chnl'), ref2);
    var list2 = new ActionList();
    for (var i = 0; i < data.length; ++i) {
      var desc4 = new ActionDescriptor();
      desc4.putDouble(cTID('Hrzn'), data[i][0]);
      desc4.putDouble(cTID('Vrtc'), data[i][1]);
      list2.putObject(cTID('Pnt '), desc4);
    }
    desc3.putList(cTID('Crv '), list2);
    list1.putObject(cTID('CrvA'), desc3);
    desc2.putList(cTID('Adjs'), list1);
    desc1.putObject(cTID('T   '), cTID('Crvs'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
  } catch (err) {
     return false;
  }
  return true;
}
