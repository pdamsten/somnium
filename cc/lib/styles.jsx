//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Layer Styles
//
//**************************************************************************

ArtLayer.prototype.setBlendIf = function(data)
{
  try {
    this.activate();
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var list1 = new ActionList();

    var desc6 = new ActionDescriptor();
    var ref5 = new ActionReference();
    ref5.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Gry '));
    desc6.putReference(cTID('Chnl'), ref5);
    desc6.putInteger(cTID('SrcB'), data[0][0]);
    desc6.putInteger(cTID('Srcl'), data[0][1]);
    desc6.putInteger(cTID('SrcW'), data[0][2]);
    desc6.putInteger(cTID('Srcm'), data[0][3]);
    desc6.putInteger(cTID('DstB'), data[0][4]);
    desc6.putInteger(cTID('Dstl'), data[0][5]);
    desc6.putInteger(cTID('DstW'), data[0][6]);
    desc6.putInteger(cTID('Dstt'), data[0][7]);
    var desc3 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Rd  '));
    desc3.putReference(cTID('Chnl'), ref2);
    desc3.putInteger(cTID('SrcB'), data[1][0]);
    desc3.putInteger(cTID('Srcl'), data[1][1]);
    desc3.putInteger(cTID('SrcW'), data[1][2]);
    desc3.putInteger(cTID('Srcm'), data[1][3]);
    desc3.putInteger(cTID('DstB'), data[1][4]);
    desc3.putInteger(cTID('Dstl'), data[1][5]);
    desc3.putInteger(cTID('DstW'), data[1][6]);
    desc3.putInteger(cTID('Dstt'), data[1][7]);
    list1.putObject(cTID('Blnd'), desc3);
    var desc4 = new ActionDescriptor();
    var ref3 = new ActionReference();
    ref3.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Grn '));
    desc4.putReference(cTID('Chnl'), ref3);
    desc4.putInteger(cTID('SrcB'), data[2][0]);
    desc4.putInteger(cTID('Srcl'), data[2][1]);
    desc4.putInteger(cTID('SrcW'), data[2][2]);
    desc4.putInteger(cTID('Srcm'), data[2][3]);
    desc4.putInteger(cTID('DstB'), data[2][4]);
    desc4.putInteger(cTID('Dstl'), data[2][5]);
    desc4.putInteger(cTID('DstW'), data[2][6]);
    desc4.putInteger(cTID('Dstt'), data[2][7]);
    list1.putObject(cTID('Blnd'), desc4);
    var desc5 = new ActionDescriptor();
    var ref4 = new ActionReference();
    ref4.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Bl  '));
    desc5.putReference(cTID('Chnl'), ref4);
    desc5.putInteger(cTID('SrcB'), data[3][0]);
    desc5.putInteger(cTID('Srcl'), data[3][1]);
    desc5.putInteger(cTID('SrcW'), data[3][2]);
    desc5.putInteger(cTID('Srcm'), data[3][3]);
    desc5.putInteger(cTID('DstB'), data[3][4]);
    desc5.putInteger(cTID('Dstl'), data[3][5]);
    desc5.putInteger(cTID('DstW'), data[3][6]);
    desc5.putInteger(cTID('Dstt'), data[3][7]);
    list1.putObject(cTID('Blnd'), desc3);
    desc2.putList(cTID('Blnd'), list1);
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
  }
}

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

ArtLayer.prototype.setLayerStyles = function(data, scale)
{
  var s = (typeof scale !== 'undefined') ?  scale : 200;
  try {
    this.activate();
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
