//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Layer Styles
//
//**************************************************************************

setColorOverlay = function(desc2, data)
{
  try {
    var desc3 = new ActionDescriptor();
    desc3.putBoolean(cTID('enab'), true);
    desc3.putBoolean(sTID("present"), true);
    desc3.putBoolean(sTID("showInDialog"), true);
    desc3.putEnumerated(cTID('Md  '), cTID('BlnM'), blendingMode(data['blendingmode']));
    var desc4 = new ActionDescriptor();
    desc4.putDouble(cTID('Rd  '), data['color'][0]);
    desc4.putDouble(cTID('Grn '), data['color'][1]);
    desc4.putDouble(cTID('Bl  '), data['color'][2]);
    desc3.putObject(cTID('Clr '), sTID("RGBColor"), desc4);
    desc3.putUnitDouble(cTID('Opct'), cTID('#Prc'), data['opacity']);
    desc2.putObject(cTID('SoFi'), cTID('SoFi'), desc3);
  } catch (e) {
    log(e);
  }
}

const Position = {'outside': 'OutF'};

setStroke = function(desc2, data)
{
  try {
    var desc5 = new ActionDescriptor();
    desc5.putBoolean(cTID('enab'), true);
    desc5.putBoolean(sTID("present"), true);
    desc5.putBoolean(sTID("showInDialog"), true);
    desc5.putEnumerated(cTID('Styl'), cTID('FStl'), cTID(Position[data['position']]));
    desc5.putEnumerated(cTID('PntT'), cTID('FrFl'), cTID('SClr'));
    desc5.putEnumerated(cTID('Md  '), cTID('BlnM'), blendingMode(data['blendingmode']));
    desc5.putUnitDouble(cTID('Opct'), cTID('#Prc'), data['opacity']);
    desc5.putUnitDouble(cTID('Sz  '), cTID('#Pxl'), data['size']);
    var desc6 = new ActionDescriptor();
    desc6.putDouble(cTID('Rd  '), data['color'][0]);
    desc6.putDouble(cTID('Grn '), data['color'][1]);
    desc6.putDouble(cTID('Bl  '), data['color'][2]);
    desc5.putObject(cTID('Clr '), sTID("RGBColor"), desc6);
    desc5.putBoolean(sTID("overprint"), data['overprint']);
    desc2.putObject(cTID('FrFX'), cTID('FrFX'), desc5);
  } catch (e) {
    log(e);
  }
}

setLayerStyles = function(layer, data, scale)
{
  var s = (typeof scale !== 'undefined') ?  scale : 200;
  try {
    layer = activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('Lefx'));
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Scl '), cTID('#Prc'), s);

    for (var key in data) {
      if (key == 'colorOverlay') {
        setColorOverlay(desc2, data[key]);
      } else if (key == 'stroke') {
        setStroke(desc2, data[key]);
      }
    }

    desc1.putObject(cTID('T   '), cTID('Lefx'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
  }
}
