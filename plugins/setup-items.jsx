//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Include Setup items
//
//**************************************************************************

var LIGHTS = 5;

onLightsDialogOK = function(data)
{
  try {
    data = JSON.parse(data);
    for (var i = 0; i < LIGHTS; ++i) {
      var n = parseInt(data['items']['role' + (i + 1)]['value']);
      if (n != 0) {
        var s = data['items']['role' + (i + 1)]['values'][n] + '\r';
        n = parseInt(data['items']['flash' + (i + 1)]['value']);
        s += data['items']['flash' + (i + 1)]['values'][n] + '\r';
        major = data['items']['power' + (i + 1)]['value'][0];
        if (major != '') {
          s += 'Power: ' + major;
          minor = data['items']['power' + (i + 1)]['value'][1];
          if (minor != '') {
            s += ' ' + minor;
          }
          s += '\r';
        }
        n = parseInt(data['items']['modifier' + (i + 1)]['value']);
        s += data['items']['modifier' + (i + 1)]['values'][n] + '\r';
        n = parseInt(data['items']['gel' + (i + 1)]['value']);
        if (n > 0) {
          s += 'Gel: ' + data['items']['gel' + (i + 1)]['values'][n] + '\r';
        }
        log(s);
        var l = findLayer('LIGHT');
        if (l != null) {
          var dl = duplicateLayer(l, 'Light ' + (i + 1));
          dl.visible = true;
          dl.textItem.contents = s;
        }
        l.visible = false;
      }
    }
  } catch (e) {
    log(e);
  }
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
                   "Yongnuo YN 560", "Yongnuo YN 565EX", "Yongnuo YN 568EX",
                   "Elinchrom RX4", "Elinchrom RX2"]
      },
      "modifier": {
        "title": "Modifier:",
        "type": "selection",
        "value": "0",
        "values": ["Reflector", "120cm Octabox", "150cm Octabox", "140cm Stripbox",
                   "40cm Beauty Dish", "60x60cm Softbox"]
      },
      "power": {
        "title": "Power:",
        "type": "pixelsize",
      },
      "gel": {
        "title": "Gel:",
        "type": "selection",
        "value": "0",
        "values": ["None", "102 Primary Red", "106 Light Scarlet",
                   "201 Deep Purple Rose", "206 Medium Purple Rose",
                   "404 Golden Amber", "405 Light Amber",
                   "501 Deep Yellow", "503 Yellow",
                   "603 Medium Green", "6001 Dark Green",
                   "8002 Deep Blue", "806 Light Blue"]
      }
    }
    dlgdata = {
      'title': 'Select Lights',
      "items": { },
      'callback': 'onLightsDialogOK'
    };

    for (var i = 0; i < LIGHTS; ++i) {
      light['header']['title'] = 'Light ' + (i + 1);
      for (key in light) {
        dlgdata['items'][key + (i + 1)] = deepCopy(light[key]);
      }
    }

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
      //log(data);
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

    openDialog(dlgdata);
  } catch (e) {
    log(e);
  }
}
