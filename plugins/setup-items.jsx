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
    data = {'msg': 'Hello World'}
    openDialog(data);
    return;

    var doc = app.activeDocument;
    doc.resizeImage(UnitValue(3543, "px"), UnitValue(2365, "px"), null, ResampleMethod.BICUBICSHARPER);

    var l = findLayer('Notes');
    if (l == null) {
      var fileRef = new File("/Users/damu/Pictures/Templates/setup_items.psd");
      var template = app.open(fileRef);
      var l = findLayer('Notes');
      duplicateLayerToDoc(l, doc.name);
      template.close(SaveOptions.DONOTSAVECHANGES);
      app.activeDocument = doc;
    }
    var file = File.openDialog("Get metadata");
    if(file != null) {
      var data = metadata(file.fsName);
      log(data);
      var l = findLayer('TITLE');
      l.textItem.contents = '“' + data['title'] + '” setup';

      var s = data['model'] + "\r" +
          data['lens'] + '\r' +
          'Focal length: ' + data['focallength'] + 'mm\r' +
          'Aperture: f/' + data['aperture'] + '\r' +
          'Exposure: ' + data['exposure'] + 'sec\r' +
          'ISO: ' + data['iso'] + '\r' +
          'GODOX Xpro-N\r' +
          'Camranger, Hähnel Radio remote'
      l = findLayer('INFO');
      l.textItem.contents = s;
    }
  } catch (e) {
    log(e);
  }
}
