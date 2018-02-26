//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Util functions
//
//**************************************************************************

openURL = function(url)
{
  var link = new File(Folder.temp + '/open.url');
  link.open('w');
  link.write('[InternetShortcut]\nURL=' + url + '\n\n');
  link.close();
  link.execute();
}

drawLine = function(name, x1, y1, x2, y2, w)
{
  try {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("contentLayer"));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    var desc4 = new ActionDescriptor();
    desc4.putDouble(cTID('Rd  '), 0);
    desc4.putDouble(cTID('Grn '), 0);
    desc4.putDouble(cTID('Bl  '), 255);
    desc3.putObject(cTID('Clr '), sTID("RGBColor"), desc4);
    desc2.putObject(cTID('Type'), sTID("solidColorLayer"), desc3);
    var desc5 = new ActionDescriptor();
    var desc6 = new ActionDescriptor();
    desc6.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), x1);
    desc6.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), y1);
    desc5.putObject(cTID('Strt'), cTID('Pnt '), desc6);
    var desc7 = new ActionDescriptor();
    desc7.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), x2);
    desc7.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), y2);
    desc5.putObject(cTID('End '), cTID('Pnt '), desc7);
    desc5.putUnitDouble(cTID('Wdth'), cTID('#Pxl'), w);
    desc2.putObject(cTID('Shp '), cTID('Ln  '), desc5);
    var desc8 = new ActionDescriptor();
    desc8.putInteger(sTID("strokeStyleVersion"), 2);
    desc8.putBoolean(sTID("strokeEnabled"), true);
    desc8.putBoolean(sTID("fillEnabled"), true);
    desc8.putUnitDouble(sTID("strokeStyleLineWidth"), cTID('#Pnt'), 0);
    desc8.putUnitDouble(sTID("strokeStyleLineDashOffset"), cTID('#Pnt'), 0);
    desc8.putDouble(sTID("strokeStyleMiterLimit"), 100);
    desc8.putEnumerated(sTID("strokeStyleLineCapType"), sTID("strokeStyleLineCapType"), sTID("strokeStyleButtCap"));
    desc8.putEnumerated(sTID("strokeStyleLineJoinType"), sTID("strokeStyleLineJoinType"), sTID("strokeStyleMiterJoin"));
    desc8.putEnumerated(sTID("strokeStyleLineAlignment"), sTID("strokeStyleLineAlignment"), sTID("strokeStyleAlignInside"));
    desc8.putBoolean(sTID("strokeStyleScaleLock"), false);
    desc8.putBoolean(sTID("strokeStyleStrokeAdjust"), false);
    var list1 = new ActionList();
    desc8.putList(sTID("strokeStyleLineDashSet"), list1);
    desc8.putEnumerated(sTID("strokeStyleBlendMode"), cTID('BlnM'), cTID('Nrml'));
    desc8.putUnitDouble(sTID("strokeStyleOpacity"), cTID('#Prc'), 100);
    var desc9 = new ActionDescriptor();
    var desc10 = new ActionDescriptor();
    desc10.putDouble(cTID('Rd  '), 0);
    desc10.putDouble(cTID('Grn '), 0);
    desc10.putDouble(cTID('Bl  '), 255);
    desc9.putObject(cTID('Clr '), sTID("RGBColor"), desc10);
    desc8.putObject(sTID("strokeStyleContent"), sTID("solidColorLayer"), desc9);
    desc8.putDouble(sTID("strokeStyleResolution"), 300);
    desc2.putObject(sTID("strokeStyle"), sTID("strokeStyle"), desc8);
    desc1.putObject(cTID('Usng'), sTID("contentLayer"), desc2);
    desc1.putInteger(cTID('LyrI'), 44);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log('drawLine', e.message);
    return null;
  }
}
