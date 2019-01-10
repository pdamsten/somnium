//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Include Setup items
//
//**************************************************************************

var LIGHTS = 5;

my_lenses = {
  'smc PENTAX-DA 18-55mm F3.5-5.6 AL II': 'Pentax smc PENTAX-DA 18-55mm F3.5-5.6 AL II',
  'smc PENTAX-DA L 18-55mm F3.5-5.6': 'Pentax smc PENTAX-DA 18-55mm F3.5-5.6 AL II',
  '18-55mm F3.5-5.6': 'Pentax smc PENTAX-DA 18-55mm F3.5-5.6 AL II',
  'smc PENTAX-DA L 18-55mm F3.5-5.6 AL': 'Pentax smc PENTAX-DA 18-55mm F3.5-5.6 AL II',
  'TAMRON AF70-300mm F/4-5.6 LD MACRO': 'Tamron AF70-300mm F/4-5.6 LD Macro',
  'Tamron AF70-300mm F/4-5.6 LD Macro (572D/A17)': 'Tamron AF70-300mm F/4-5.6 LD Macro',
  '14.0-24.0 mm f/2.8': 'Nikon AF-S Nikkor 14-24mm f/2.8G ED',
  '14-24mm f/2.8': 'Nikon AF-S Nikkor 14-24mm f/2.8G ED',
  '14-24mm F2.8': 'Nikon AF-S Nikkor 14-24mm f/2.8G ED',
  '24.0-70.0 mm f/2.8': 'Nikon AF-S Zoom-Nikkor 24-70mm f/2.8G ED',
  '24-70mm F2.8': 'Nikon AF-S Zoom-Nikkor 24-70mm f/2.8G ED',
  '70.0-200.0 mm f/2.8': 'Nikon AF-S Nikkor 70-200mm f/2.8G ED VR II',
  '70-200mm F2.8': 'Nikon AF-S Nikkor 70-200mm f/2.8G ED VR II',
  '70-200mm f/2.8': 'Nikon AF-S Nikkor 70-200mm f/2.8G ED VR II',
  '50.0 mm f/1.4': 'Nikon AF-S Nikkor 50mm f/1.4G',
  '50mm F1.4': 'Nikon AF-S Nikkor 50mm f/1.4G',
  '85.0 mm f/1.4': 'Nikon AF Nikkor 85mm f/1.4D IF',
  '16.0 mm f/2.8': 'Nikon AF Fisheye-Nikkor 16mm f/2.8D',
  'X': 'Sigma 50mm F1.4 EX DG HSM',
  '35.0 mm f/1.8': 'Nikon AF-S DX Nikkor 35mm f/1.8G',
  '35mm F1.8': 'Nikon AF-S DX Nikkor 35mm f/1.8G',
  '18.0-200.0 mm f/3.5-5.6': 'Nikon AF-S DX Nikkor 18-200mm f/3.5-5.6G ED VR II',
  '18-200mm F3.5-5.6': 'Nikon AF-S DX Nikkor 18-200mm f/3.5-5.6G ED VR II',
  '0.0 mm f/0': 'Samyang 8mm f/3.5 Fisheye',
  '0mm F0': 'Samyang 8mm f/3.5 Fisheye',
  '0.0 mm f/0.0': 'Samyang 8mm f/3.5 Fisheye',
  '100mm F2.8': 'Tokina AT-X M100 PRO D 100mm f/2.8 Macro',
  '100.0 mm f/2.8': 'Tokina AT-X M100 PRO D 100mm f/2.8 Macro',
  '10-20mm F3.5': 'Sigma 10-20mm F3.5 EX DC HSM',
  '10.0-20.0 mm f/3.5': 'Sigma 10-20mm F3.5 EX DC HSM',
  '150-500mm F5-6.3': 'Sigma APO 150-500mm F5-6.3 DG OS HSM',
  '150.0-500.0 mm f/5-6.3': 'Sigma APO 150-500mm F5-6.3 DG OS HSM',
  '150.0-500.0 mm f/5.0-6.3': 'Sigma APO 150-500mm F5-6.3 DG OS HSM',
  'Apple iPhone 5': 'iPhone 5',
  '7.4-22.2 mm': 'Canon Ixus 400',
  'XF35mmF1.4 R': 'Fujinon XF35mmF1.4 R',
  '35mm f/2.8': 'Olympus mju II',
}

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
        var l = findLayer('LIGHT');
        if (l != null) {
          var dl = duplicateLayer(l, 'Light ' + (i + 1));
          dl.visible = true;
          dl.textItem.contents = s;
          dl.translate((i + 1) * 300, (i + 1) * 300)
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

      var lens = data['lens'];
      if (lens in my_lenses) {
        lens = my_lenses[lens];
      }

      var s = data['model'] + "\r" +
          lens + '\r' +
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
