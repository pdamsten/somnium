//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Util functions
//
//**************************************************************************

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

blendingMode = function(mode)
{
  var modes = {'color': 'Clr ', 'luminosity': 'Lmns', 'subtract': 'Sbtr',
               'vividLight': 'vividLight', 'linearLight': 'linearLight',
               'overlay': 'Ovrl'};

  if (modes[mode].length > 4) {
    return sTID(modes[mode]);
  } else {
    return cTID(modes[mode]);
  }
}

mkdir = function(dir)
{
  var folder = Folder(dir);

  if(!folder.exists) {
    folder.create();
  }
}

padNum = function(num, size)
{
  var s = '0000000000000000' + num;
  return s.substr(s.length - size);
}

writeTextFile = function(fname, txt)
{
  var tfile = new File(fname);
  tfile.encoding = "BINARY"; // For proper line ending
  tfile.open('w');
  tfile.write(txt);
  tfile.close();
}

openURL = function(url)
{
  var link = new File(Folder.temp + '/open.url');
  link.open('w');
  link.write('[InternetShortcut]\nURL=' + url + '\n\n');
  link.close();
  link.execute();
}

fitWindow = function()
{
  var idinvokeCommand = sTID("invokeCommand");
  var desc125 = new ActionDescriptor();
  var idcommandID = sTID("commandID");
  desc125.putInteger( idcommandID, 1192);
  var idkcanDispatchWhileModal = sTID("kcanDispatchWhileModal");
  desc125.putBoolean( idkcanDispatchWhileModal, true);
  executeAction(idinvokeCommand, desc125, DialogModes.NO);
  app.refresh();
}

selectTool = function(tool)
{
  tools = {'brush': cTID('PbTl'), 'burn': cTID('BrTl')};
  try {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(tools[tool]);
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
  } catch (e) {
    log(e.message);
    return false;
  }
  return true;
}

setDefaultColors = function()
{
  try {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Clr '), cTID('Clrs'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Rset'), desc1, dialogMode);
  } catch (e) {
    log(e.message);
    return false;
  }
  return true;
}

waitForRedraw = function()
{
  var eventWait = cTID("Wait")
  var enumRedrawComplete = cTID("RdCm")
  var typeState = cTID("Stte")
  var keyState = cTID("Stte")
  var desc = new ActionDescriptor()
  desc.putEnumerated(keyState, typeState, enumRedrawComplete)
  executeAction(eventWait, desc, DialogModes.NO)
}

randomString = function(length)
{
  var s = '';
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  length = (typeof length !== 'undefined') ? 8 : length;

  for (var i = 0; i < length; ++i) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

exportAsJpeg = function(filepath, x, y) // export does not support res?
{
  exportOptionsSaveForWeb = new ExportOptionsSaveForWeb();
  exportOptionsSaveForWeb.quality = 95;
  exportOptionsSaveForWeb.includeProfile = true;
  exportOptionsSaveForWeb.optimised = true;
  exportOptionsSaveForWeb.format = SaveDocumentType.JPEG;

  var saveFile = new File(filepath);
  datRef.exportDocument(saveFile, ExportType.SAVEFORWEB, exportOptionsSaveForWeb);
}

saveAsJpeg = function(filepath, x, y)
{
  var active = app.activeDocument;
  var newDoc = app.activeDocument.duplicate(randomString(8));

  newDoc.flatten();

  if (newDoc.height / newDoc.width < 1.0 * x / 1.0 * y) {
    newDoc.resizeImage(null, UnitValue(y, "px"), null, ResampleMethod.BICUBICSHARPER);
  } else {
    newDoc.resizeImage(UnitValue(x, "px"), null, null, ResampleMethod.BICUBICSHARPER);
  }

  newDoc.convertProfile('sRGB IEC61966-2.1', Intent.RELATIVECOLORIMETRIC, true, false);
  newDoc.bitsPerChannel = BitsPerChannelType.EIGHT;

  var file = File(filepath);
  var options = new JPEGSaveOptions();
  options.embedColorProfile = true;
  options.formatOptions = FormatOptions.STANDARDBASELINE;
  options.matte = MatteType.NONE;
  options.quality = 11;
  newDoc.saveAs(file, options, true, Extension.LOWERCASE);

  newDoc.close(SaveOptions.DONOTSAVECHANGES);
  app.activeDocument = active;
}

saveAsPng = function(filepath, x, y)
{
  var active = app.activeDocument;
  var newDoc = app.activeDocument.duplicate(randomString(8));

  newDoc.flatten();

  if (newDoc.height / newDoc.width < 1.0 * x / 1.0 * y) {
    newDoc.resizeImage(null, UnitValue(y, "px"), null, ResampleMethod.BICUBICSHARPER);
  } else {
    newDoc.resizeImage(UnitValue(x, "px"), null, null, ResampleMethod.BICUBICSHARPER);
  }

  newDoc.convertProfile('sRGB IEC61966-2.1', Intent.RELATIVECOLORIMETRIC, true, false);
  newDoc.bitsPerChannel = BitsPerChannelType.EIGHT;

  var file = File(filepath);
  var options = new PNGSaveOptions();
  options.compression = 9;
  options.interlaced = false;
  newDoc.saveAs(file, options, true, Extension.LOWERCASE);

  newDoc.close(SaveOptions.DONOTSAVECHANGES);
  app.activeDocument = active;
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
    log(e);
    return null;
  }
}
