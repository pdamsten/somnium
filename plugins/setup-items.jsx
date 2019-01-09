//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Include Setup items
//
//**************************************************************************

lightsReady = function(data)
{
  console.log('lightsReady');
}

onIncludeSetupClick = function()
{
  try {
    light = {
      "header": {
        "title": "Light 1",
        "type": "label",
      },
      "role": {
        "title": "Role:",
        "type": "selection",
        "value": "0",
        "values": ["None", "Key Light", "Accent Light", "Hair Light", "Fill Light"]
      },
      "flash": {
        "title": "Flash:",
        "type": "selection",
        "value": "0",
        "values": ["Godox AD200", "Godox AD600BM", "Godox QS600", "Godox QS300",
                   "Yongnuo YN 560", "Yongnuo YN 565EX", "Yongnuo YN 568EX"]
      },
      "modifier": {
        "title": "Modifier:",
        "type": "selection",
        "value": "0",
        "values": ["Reflector", "120cm Octabox", "150cm Octabox", "140cm Stripbox",
                   "40cm Beauty Dish"]
      },
      "power": {
        "title": "Power:",
        "type": "pixelsize",
      },
      "gel": {
        "title": "Gel:",
        "type": "selection",
        "value": "0",
        "values": ["None", "", "", ""]
      }
    }
    data = {
      'title': 'Select Lights',
      "items": { },
      'callback': 'lightsReady'
    };

    for (var i = 0; i < 5; ++i) {
      light['header']['title'] = 'Light ' + (i + 1);
      for (key in light) {
        data['items'][key + (i + 1)] = deepCopy(light[key]);
      }
    }
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
