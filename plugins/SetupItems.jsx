//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Include Setup items
//
//**************************************************************************

SetupItems = (function() {

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

light = {
  "header": {
    "title": "Light 1",
    "type": "label",
  },
  "role": {
    "title": "Role:",
    "type": "selection",
    "value": "0",
    "values": ["None", "Key Light", "Accent Light", "Hair Light", "Fill Light",
               "Background Light"]
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
    "values": ["18cm Reflector", "18cm Reflector with grid",
               "120cm Octabox", "150cm Octabox", "140cm Stripbox",
               "40cm Beauty Dish", "40cm Beauty Dish with Grid", "60x60cm Softbox"]
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
};

dlgdata = {
  'title': 'Select Lights',
  "items": {
    "stand": {
      "title": "Stand:",
      "type": "selection",
      "value": "0",
      "values": ["None", "Gitzo GT2542T & RRS BH-30", "Manfrotto 055XPROB & 498RC2",
                 "Manfrotto 055XPROB & 327RC2", "Fotometal M & Manfrotto MHXPRO-3W"]
    },
    "remote": {
      "title": "Remote:",
      "type": "selection",
      "value": "0",
      "values": ["None", "Camranger", "Hähnel Giga T Pro II"]
    },
    "trigger": {
      "title": "Trigger:",
      "type": "selection",
      "value": "0",
      "values": ["Godox Xpro-N", "Elinchrom Skyport Speed", "None"]
    },
  },
  'callback': 'SetupItems.onLightsDialogOK'
};

nikTonalContrast = function()
{
  var desc1 = new ActionDescriptor();
  desc1.putInteger(cTID('dRes'), 5104);
  desc1.putString(cTID('conf'), "PENvbG9yRWZleFBybzRfZmlsdGVyPgoJPGZpbHRlciBuYW1lPSJUb25hbENvbnRyYXN0XzMiPgoJCTxwYXJhbWV0ZXIgbmFtZT0ic3RyZW5ndGgwX2hpIiB2YWx1ZT0iMjUiIHZhbHVlVHlwZT0iZmxvYXQiLz4KCQk8cGFyYW1ldGVyIG5hbWU9InN0cmVuZ3RoMF9tZWQiIHZhbHVlPSI1MCIgdmFsdWVUeXBlPSJmbG9hdCIvPgoJCTxwYXJhbWV0ZXIgbmFtZT0ic3RyZW5ndGgwX2xvdyIgdmFsdWU9IjI1IiB2YWx1ZVR5cGU9ImZsb2F0Ii8+CgkJPHBhcmFtZXRlciBuYW1lPSJzYXR1cmF0aW9uIiB2YWx1ZT0iMCIgdmFsdWVUeXBlPSJmbG9hdCIvPgoJCTxwYXJhbWV0ZXIgbmFtZT0iVENUeXBlQ29tYm8iIHZhbHVlPSIwIiB2YWx1ZVR5cGU9ImludCIvPgoJCTxwYXJhbWV0ZXIgbmFtZT0icHJvdGVjdF9zaGFkb3dzIiB2YWx1ZT0iMCIgdmFsdWVUeXBlPSJmbG9hdCIvPgoJCTxwYXJhbWV0ZXIgbmFtZT0icHJvdGVjdF9oaWxpZ2h0cyIgdmFsdWU9IjAiIHZhbHVlVHlwZT0iZmxvYXQiLz4KCQk8cGFyYW1ldGVyIG5hbWU9ImJhc2VGaWxsIiB2YWx1ZT0iMSIgdmFsdWVUeXBlPSJmbG9hdCIvPgoJCTxwYXJhbWV0ZXIgbmFtZT0id2hvbGVGaWx0ZXJEZWFjdGl2YXRlZCIgdmFsdWU9IjAiIHZhbHVlVHlwZT0iaW50Ii8+Cgk8L2ZpbHRlcj4KPC9Db2xvckVmZXhQcm80X2ZpbHRlcj4KCgA=");
  desc1.putString(cTID('name'), "Tonal Contrast (CEP 4)");
  executeAction(sTID('com.niksoftware.cep4.ps.filter'), desc1, DialogModes.NO);
};

return { // public:

title: 'Include Setup Items',
help: 'Import items for making setup images.',

onClick: function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;

    // Resize 30x20cm
    doc.resizeImage(UnitValue(30, "cm"), UnitValue(20, "cm"), 300, ResampleMethod.BICUBICSHARPER);

    // NIK Tonal
    if (!current.hasSmartFilters()) {
      if (current.kind != LayerKind.SMARTOBJECT) {
        current.convertToSmartObject(current.name);
      }
      nikTonalContrast();
    }

    // Dodge & Burn
    if (doc.findLayer('Dodge & Burn') == null) {
      onMakeDBClick();
    }

    // Color
    if (doc.findLayer('Color') == null) {
      setColorTheme('Why So Serious?');
    }

    // Sharpening
    if (doc.findLayer('High Pass Sharpening') == null) {
      onHighPassSharpeningClick();
    }

    var l = doc.findLayer('Notes');
    if (l == null) {
      // Copy notes layers from setup_items.psd
      var fileRef = new File("/Users/damu/Pictures/Templates/setup_items.psd");
      var template = app.open(fileRef);
      var l = template.findLayer('Notes');
      l.duplicateToDoc(doc.name);
      template.close(SaveOptions.DONOTSAVECHANGES);
      app.activeDocument = doc;
    }

    // Get metadata from jpg
    var file = File.openDialog("Get metadata");
    if(file != null) {
      var data = Metadata.get(file.fsName);
      //log(data);
      var l = doc.findLayer('TITLE');
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
          'ISO: ' + data['iso'];
      l = doc.findLayer('INFO');
      l.textItem.contents = s;
    }

    // Show dialog for lighting information

    // multiply data for 5 lights
    for (var i = 0; i < LIGHTS; ++i) {
      light['header']['title'] = 'Light ' + (i + 1);
      for (key in light) {
        dlgdata['items'][key + (i + 1)] = Object.deepCopy(light[key]);
      }
    }
    UI.openDialog(dlgdata);
  } catch (e) {
    log(e);
  }
},

onLightsDialogOK: function(data)
{
  try {
    var doc = app.activeDocument;
    data = JSON.parse(data);
    for (var i = 0; i < LIGHTS; ++i) {
      var n = parseInt(data['items']['role' + (i + 1)]['value']);
      if (n != 0) {
        var role = data['items']['role' + (i + 1)]['values'][n];
        var s = role + '\r';
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
        var l = doc.findLayer('LIGHT');
        if (l != null) {
          var dl = l.duplicateEx('Light ' + (i + 1) + ' - ' + role);
          dl.visible = true;
          dl.textItem.contents = s;
          dl.translate((i + 1) * 300, (i + 1) * 300)
        }
        l.visible = false;
      }
    }
    s = ''
    n = parseInt(data['items']['trigger']['value']);
    if (n != 2) {
      s += '\rTrigger: ' + data['items']['trigger']['values'][n];
    }
    n = parseInt(data['items']['stand']['value']);
    if (n != 0) {
      s += '\rStand: ' + data['items']['stand']['values'][n];
    }
    n = parseInt(data['items']['remote']['value']);
    if (n != 0) {
      s += '\rRemote: ' + data['items']['remote']['values'][n];
    }
    l = doc.findLayer('INFO');
    l.textItem.contents = l.textItem.contents + s;
  } catch (e) {
    log(e);
  }
}

};})();
