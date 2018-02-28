//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Adjustment layer handling
//
//**************************************************************************

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

createCurveAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
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
  } catch (e) {
    log(e);
    return null;
  }
}

setCurveAdjustment = function(layer, data)
{
  try {
    activateLayer(layer);
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
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

scurve = function(percentage, dark, light)
{
  var adjust = percentage / 100.0 * 255;
  var darkgain = (typeof dark !== 'undefined') ?  dark / 100.0 * 255 : 0;
  var lightdrop = (typeof light !== 'undefined') ?  light / 100.0 * 255 : 0;
  return [[0, darkgain], [64, 64 - adjust], [192, 192 + adjust], [255, 255 - lightdrop]];
}

createChannelMixer = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    var desc4 = new ActionDescriptor();
    desc4.putUnitDouble(cTID('Rd  '), cTID('#Prc'), 100);
    desc3.putObject(cTID('Rd  '), cTID('ChMx'), desc4);
    var desc5 = new ActionDescriptor();
    desc5.putUnitDouble(cTID('Grn '), cTID('#Prc'), 100);
    desc3.putObject(cTID('Grn '), cTID('ChMx'), desc5);
    var desc6 = new ActionDescriptor();
    desc6.putUnitDouble(cTID('Bl  '), cTID('#Prc'), 100);
    desc3.putObject(cTID('Bl  '), cTID('ChMx'), desc6);
    desc2.putObject(cTID('Type'), cTID('ChnM'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setChannelMixer = function(layer, color, cnst, mono)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
    desc2.putBoolean(cTID('Mnch'), mono);
    var desc3 = new ActionDescriptor();
    desc3.putUnitDouble(cTID('Rd  '), cTID('#Prc'), color[0]);
    desc3.putUnitDouble(cTID('Grn '), cTID('#Prc'), color[1]);
    desc3.putUnitDouble(cTID('Bl  '), cTID('#Prc'), color[2]);
    desc3.putUnitDouble(cTID('Cnst'), cTID('#Prc'), cnst);
    desc2.putObject(cTID('Gry '), cTID('ChMx'), desc3);
    desc1.putObject(cTID('T   '), cTID('ChnM'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
     return false;
  }
}

createSolidColorAdjustment = function(name, layer, color)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("contentLayer"));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    var desc4 = new ActionDescriptor();
    desc4.putDouble(cTID('Rd  '), color[0]);
    desc4.putDouble(cTID('Grn '), color[1]);
    desc4.putDouble(cTID('Bl  '), color[2]);
    desc3.putObject(cTID('Clr '), sTID("RGBColor"), desc4);
    desc2.putObject(cTID('Type'), sTID("solidColorLayer"), desc3);
    desc1.putObject(cTID('Usng'), sTID("contentLayer"), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
     return null;
  }
};

createHueSaturationAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc3.putBoolean(cTID('Clrz'), false);
    desc2.putObject(cTID('Type'), cTID('HStr'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setHueSaturationAdjustment = function(layer, hue, saturation, lightness)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
    var list1 = new ActionList();
    var desc3 = new ActionDescriptor();
    desc3.putInteger(cTID('H   '), hue);
    desc3.putInteger(cTID('Strt'), saturation);
    desc3.putInteger(cTID('Lght'), lightness);
    list1.putObject(cTID('Hst2'), desc3);
    desc2.putList(cTID('Adjs'), list1);
    desc1.putObject(cTID('T   '), cTID('HStr'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

createSelectiveColorAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc2.putObject(cTID('Type'), cTID('SlcC'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setSelectiveColorAdjustment = function(layer, color, values)
{
  var colors = {'reds': 'Rds ', 'yellows': 'Ylws', 'greens': 'Grns', 'cyans': 'Cyns',
                'blues': 'Bls ', 'magentas': 'Mgnt', 'whites': 'Whts', 'neutrals': 'Ntrl',
                'blacks': 'Blks'}
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var list1 = new ActionList();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(cTID('Clrs'), cTID('Clrs'), cTID(colors[color]));
    desc3.putUnitDouble(cTID('Cyn '), cTID('#Prc'), values[0]);
    desc3.putUnitDouble(cTID('Mgnt'), cTID('#Prc'), values[1]);
    desc3.putUnitDouble(cTID('Ylw '), cTID('#Prc'), values[2]);
    desc3.putUnitDouble(cTID('Blck'), cTID('#Prc'), values[3]);
    list1.putObject(cTID('ClrC'), desc3);
    desc2.putList(cTID('ClrC'), list1);
    desc1.putObject(cTID('T   '), cTID('SlcC'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}
