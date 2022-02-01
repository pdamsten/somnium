//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//  Copyright (c) 2018-2020 by Petri Damstén <petri.damsten@gmail.com>
//
//  This file is part of Somnium.
//
//  Somnium is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  Foobar is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with Somnium.  If not, see <https://www.gnu.org/licenses/>.
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

Object.isDictionary = function()
{
  return (typeof this === 'object') && (this !== null) &&
         !(this instanceof Array) && !(this instanceof Date);
}

Object.deepCopy = function(src)
{
  var dest = {};

  for (var prop in src) {
    if (src.hasOwnProperty(prop)) {
      if (Object.isDictionary(src[prop])) {
        dest[prop] = Object.deepCopy(src[prop]);
      } else {
        dest[prop] = src[prop];
      }
    }
  }
  return dest;
}

Path = (function() {

var LATIN = {'å': 'a',
             'ä': 'a',
             'ö': 'o',
             'é': 'e'};

var REPLACECHARS = [[' …', ''],
                    ['…', ''],
                    [' / ', '_'],
                    ['/', '-'],
                    [' & ', '_and_'],
                    ['&', '_and_'],
                    [', ', '_'],
                    [',', '_'],
                    ['\\. ', '_'],
                    ['\\.', ''],
                    [':', '_'],
                    ['\\\\', '-'],
                    ['\\*', '-'],
                    ['#', ''],
                    ['\\?', ''],
                    ['!', ''],
                    ['<', '-'],
                    ['>', '-'],
                    ['"', ''],
                    ['\'', ''],
                    ['\\|', '-'],
                    [' - ', '-'],
                    ['- ', '-'],
                    [' -', '-'],
                    [' ', '_']];

return { // public:

simplename: function(filename)
{
  var s = filename.toLowerCase();
  /* TODO how to convert non ascii characters?
  for (var i = 0; i < s.length; ++i) {
    log(s[i], s.charAt(i), LATIN[i]);
    s[i] = LATIN[i] ? LATIN[i] : s[i];
  }*/
  for (var i = 0; i < REPLACECHARS.length; ++i) {
    var re = new RegExp(REPLACECHARS[i][0], "g");
    s = s.replace(re, REPLACECHARS[i][1]);
  }
  s = s.replace(/[^\x00-\x7F]/g, '');
  s = s.replace(/_{2,}/g, '_');
  s = s.substring(0, 64);
  return s;
},

basename: function(filename)
{
  return filename.split(sep()).reverse()[0];
},

dirname: function(filename)
{
  return filename.replace(this.basename(filename), '');
},

ext: function(filename)
{
  var name = this.basename(filename);

  if (name.indexOf('.') > 0) {
    return '.' + name.split('.').reverse()[0];
  }
  return '';
},

removeExt: function(filename)
{
  if (filename.indexOf('.') < 0) {
    return filename;
  }
  return filename.split('.').slice(0, -1).join('.');
},

uniqueFilename: function(path, name, ext)
{
  path = addPathSep(File(path).fsName); // absolute path
  name = Path.removeExt(name);
  if (mkdir(path)) {
    var add = '';
    var n = 0;
    while (1) {
      var filename = path + name + add + ext;
      var f = File(filename);
      if(!f.exists) {
        return filename;
      }
      ++n;
      add = '-' + n;
    }
  }
  return false;
}

};})();

SUI = (function() {

var xLib = null;
var LAST_MESSAGE = '';

return { // public:

INFO: 1,
WARNING: 2,
ERROR: 3,

setElements: function(data)
{
  this.dispatchEvent('setui', JSON.stringify(data));
},

openDialog: function(data)
{
  this.dispatchEvent('opendialog', JSON.stringify(data));
},

dispatchEvent: function(e, data)
{
  try {
    if (!xLib) {
      xLib = new ExternalObject("lib:\PlugPlugExternalObject");
    }
    if (xLib) {
      var event = new CSXSEvent();
      event.type = 'com.petridamsten.somnium.' + e;
      event.data = data;
      event.dispatch();
    }
  } catch (e) {
    salert(e);
  }
},

msg: function(type, title, txt)
{
  var msg = {'type': type, 'title': title, 'msg': txt};
  LAST_MESSAGE = JSON.stringify(msg);
  return LAST_MESSAGE;
}

};})();


Document.prototype.contentAwareFill = function()
{
  try {
    app.activeDocument.activate();
    var desc1 = new ActionDescriptor();
    desc1.putEnumerated(cTID('Usng'), cTID('FlCn'), sTID("contentAware"));
    desc1.putBoolean(sTID("contentAwareColorAdaptationFill"), true);
    desc1.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100);
    desc1.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    executeAction(cTID('Fl  '), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

Document.prototype.contentAwareFillDialog = function()
{
  try {
    app.activeDocument.activate();
    var desc1 = new ActionDescriptor();
    desc1.putEnumerated(sTID("cafColorAdaptationLevel"), sTID("cafColorAdaptationLevel"),
                        sTID("cafColorAdaptationDefault"));
    desc1.putEnumerated(sTID("cafRotationAmount"), sTID("cafRotationAmount"),
                        sTID("cafRotationAmountNone"));
    desc1.putBoolean(sTID("cafScale"), false);
    desc1.putBoolean(sTID("cafMirror"), false);
    desc1.putEnumerated(sTID("cafOutput"), sTID("cafOutput"), sTID("cafOutputToNewLayer"));
    executeAction(sTID('cafWorkspace'), desc1, DialogModes.ALL);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

Document.prototype.exportAsJpeg = function(filepath, x, y) // export does not support res?
{
  app.activeDocument.activate();
  exportOptionsSaveForWeb = new ExportOptionsSaveForWeb();
  exportOptionsSaveForWeb.quality = 95;
  exportOptionsSaveForWeb.includeProfile = true;
  exportOptionsSaveForWeb.optimised = true;
  exportOptionsSaveForWeb.format = SaveDocumentType.JPEG;

  var saveFile = new File(filepath);
  datRef.exportDocument(saveFile, ExportType.SAVEFORWEB, exportOptionsSaveForWeb);
}

Document.prototype.saveAsFlatPSB = function(filepath)
{
  app.activeDocument.activate();
  var desc1 = new ActionDescriptor();
  var desc2 = new ActionDescriptor();
  desc2.putBoolean(sTID("maximizeCompatibility"), false);
  desc1.putObject(cTID('As  '), sTID("largeDocumentFormat"), desc2);
  desc1.putPath(cTID('In  '), new File(filepath));
  desc1.putInteger(cTID('DocI'), 1077);
  desc1.putBoolean(cTID('Cpy '), true);
  desc1.putBoolean(cTID('LwCs'), true);
  desc1.putBoolean(cTID('Lyrs'), false);
  executeAction(cTID('save'), desc1, DialogModes.NO);
}

Document.prototype.saveAsJpeg = function(filepath, x, y, minx, miny, color)
{
  try {
    app.activeDocument.activate();
    var active = app.activeDocument;
    var newDoc = active.duplicate(String.random(8));

    newDoc.flatten();

    if (x > 0 || y > 0) {
      if (1.0 * newDoc.height.as("px") / 1.0 * newDoc.width.as("px") < 1.0 * x / 1.0 * y) {
        newDoc.resizeImage(null, UnitValue(y, "px"), null, ResampleMethod.BICUBICSHARPER);
      } else {
        newDoc.resizeImage(UnitValue(x, "px"), null, null, ResampleMethod.BICUBICSHARPER);
      }
    }

    if (minx > 0 || miny > 0) {
      var clr = new SolidColor();
      clr.rgb.red = color[0];
      clr.rgb.green = color[1];
      clr.rgb.blue = color[2];
      app.backgroundColor = clr;

      if (newDoc.width.as("px") < minx) {
        newDoc.resizeCanvas(UnitValue(minx, "px"), null, AnchorPosition.MIDDLECENTER);
      }
      if (newDoc.height.as("px") < miny) {
        newDoc.resizeCanvas(null, UnitValue(miny, "px"), AnchorPosition.MIDDLECENTER);
      }
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
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

Document.prototype.saveAsPng = function(filepath, x, y)
{
  app.activeDocument.activate();
  var active = app.activeDocument;
  var newDoc = app.activeDocument.duplicate(String.random(8));

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

Document.prototype.drawLine = function(name, x1, y1, x2, y2, w)
{
  try {
    app.activeDocument.activate();
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

Photoshop = (function() {

return { // public:

blendingMode: function(mode)
{
  var modes = {'normal': 'Nrml', 'dissolve':'Dslv', 'darken': 'Drkn', 'multiply': 'Mltp',
      'color burn': 'CBrn', 'linear burn': 'linearBurn', 'darker color': 'darkerColor',
      'lighten': 'Lghn', 'screen': 'Scrn', 'color dodge': 'CDdg', 'linear dodge': 'linearDodge',
      'lighter color': 'lighterColor', 'overlay': 'Ovrl', 'soft light': 'SftL',
      'hard light': 'HrdL', 'vivid light': 'vividLight', 'linear light': 'linearLight',
      'pin light': 'pinLight', 'hard mix': 'hardMix', 'difference': 'Dfrn', 'exclusion': 'Xclu',
      'subtract': 'Sbtr', 'divide': 'blendDivide', 'hue': 'H   ',
      'saturation': 'Strt', 'color': 'Clr ', 'luminosity': 'Lmns'};

  if (modes[mode].length > 4) {
    return sTID(modes[mode]);
  } else {
    return cTID(modes[mode]);
  }
},

zoom: function(percentage)
{
  try {
    var d1 = new ActionDescriptor();
    var r1 = new ActionReference();
    r1.putProperty(sTID("property"), sTID("zoom"));
    r1.putEnumerated(sTID("document"), sTID("ordinal"), sTID("targetEnum"));
    d1.putReference(sTID("null"), r1);
    var d2 = new ActionDescriptor();
    d2.putDouble(stringIDToTypeID("zoom"), percentage / 100);
    d1.putObject(stringIDToTypeID("to"), stringIDToTypeID("zoom"), d2);
    executeAction(stringIDToTypeID("set"), d1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
},

fitWindow: function()
{
  try {
    var idinvokeCommand = sTID("invokeCommand");
    var desc125 = new ActionDescriptor();
    var idcommandID = sTID("commandID");
    desc125.putInteger(idcommandID, 1192);
    var idkcanDispatchWhileModal = sTID("kcanDispatchWhileModal");
    desc125.putBoolean(idkcanDispatchWhileModal, true);
    executeAction(idinvokeCommand, desc125, DialogModes.NO);
    app.refresh();
  } catch (e) {
    log(e);
    return false;
  }
  return true;
},

selectTool: function(tool)
{
  tools = {'brush': cTID('PbTl'), 'burn': cTID('BrTl')};
  try {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(tools[tool]);
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
},

setDefaultColors: function()
{
  try {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Clr '), cTID('Clrs'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Rset'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
},

waitForRedraw: function()
{
  var eventWait = cTID("Wait")
  var enumRedrawComplete = cTID("RdCm")
  var typeState = cTID("Stte")
  var keyState = cTID("Stte")
  var desc = new ActionDescriptor()
  desc.putEnumerated(keyState, typeState, enumRedrawComplete)
  executeAction(eventWait, desc, DialogModes.NO)
},

};})();

String.random = function(length)
{
  var s = '';
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  length = (typeof length !== 'undefined') ? 8 : length;

  for (var i = 0; i < length; ++i) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

fileVersion = function(filename)
{
  var s = '';
  var f = File(filename);
  s = '' + f.modified.getFullYear() + f.modified.getMonth().toString().padStart(2, '0') +
      f.modified.getDate().toString().padStart(2, '0');
  return s;
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
  link.encoding = "BINARY"; // For proper line ending
  link.open('w');
  link.write('[InternetShortcut]\nURL=' + url + '\n\n');
  link.close();
  link.execute();
}

importPlugins = function(pluginPath)
{
  try {
    var plugins = [];
    var pluginFolder = new Folder(pluginPath);
    if (pluginFolder != null) {
      var fileList = pluginFolder.getFiles('*.jsx');
      for (var i = 0 ;i < fileList.length; i++) {
        include(fileList[i].fsName);
        var name = Path.removeExt(Path.basename(fileList[i].fsName));
        var info = {'id': name, 'group': 'Plugins', 'title': '',
                    'help': 'User defined plugin.', 'icon': 'img/icon-default.svg',
                    'call': name + '.onClick'};
        var plugin = this[name];
        if (plugin) {
          if (plugin.title) {
            info['title'] = plugin.title;
          }
          if (plugin.help) {
            info['help'] = plugin.help;
          }
          if (plugin.icon) {
            var svg = pluginPath + plugin.icon;
          } else {
            var svg = pluginPath + name + '.svg';
          }
          var f = new File(svg);
          if (f.exists) {
            info['icon'] = svg;
          }
          plugins.push(info);
        }
      }
    }
    return plugins;
  } catch (e) {
    log(e);
    return {};
  }
}
