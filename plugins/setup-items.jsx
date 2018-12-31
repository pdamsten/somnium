//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Include Setup items
//
//**************************************************************************

onIncludeSetupClick = function()
{
  try {
    var doc = app.activeDocument;
    doc.resizeImage(UnitValue(3543, "px"), UnitValue(2365, "px"), null, ResampleMethod.BICUBICSHARPER);

    var l = findLayer('Notes');
    if (l == null) {
      var fileRef = new File("/Users/damu/Pictures/Templates/setup_items.psdt");
      var template = app.open(fileRef);
      var l = findLayer('Notes');
      duplicateLayerToDoc(l, doc.name);
      template.close(SaveOptions.DONOTSAVECHANGES);
      app.activeDocument = doc;
    }
    var file = File.openDialog("Setup diagram image");
    if(file != null) {
      ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
      var xmpfile = new XMPFile(file.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
      var xmp = xmpfile.getXMP();
      //log(xmp.serialize());
      var l = findLayer('“X” setup');
      l.textItem.contents = '“' + xmp.getProperty(XMPConst.NS_DC, "title[1]").toString() + '” setup';
    }
  } catch (e) {
    log(e);
  }
}
