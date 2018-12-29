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

    var fileRef = new File("/Users/damu/Pictures/Templates/setup_items.psdt");
    var template = app.open(fileRef);
    var l = findLayer('Notes');
    duplicateLayerToDoc(l, doc.name);
    template.close(SaveOptions.DONOTSAVECHANGES);
    app.activeDocument = doc;
  } catch (e) {
    log(e);
  }
}
