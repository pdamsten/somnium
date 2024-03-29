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

exportFile = function(key)
{
  try {
    var path = settings.value(key, 'path');
    var filename = Path.uniqueFilename(path, app.activeDocument.name, '.jpg');
    if (filename === false) {
      return SUI.LAST_MESSAGE;
    }
    var size = settings.value(key, 'maxsize');
    var minsize = settings.value(key, 'minsize');
    var color = settings.value(key, 'paddingcolor');
    color = color.substring(4, color.length - 1).replace(/ /g, '').split(',');
    if (app.activeDocument.saveAsJpeg(filename, parseInt(size[0]), parseInt(size[1]),
                                      parseInt(minsize[0]), parseInt(minsize[1]), color)) {
      var s = SUI.msg(SUI.INFO, 'Export', filename + ' saved succesfully.');
    } else {
      var s = SUI.msg(SUI.ERROR, 'Export', 'Saving ' + filename + ' failed.');
    }
    return s;
  } catch (e) {
    log(e);
  }
}

onSaveFbClick = function()
{
  return exportFile('SaveFb');
}

onSaveInstaClick = function()
{
  return exportFile('SaveInsta');
}

onSaveTwitterClick = function()
{
  return exportFile('SaveTwitter');
}

onSave4KClick = function()
{
  return exportFile('Save4K');
}

onExport1Click = function()
{
  return exportFile('Export1');
}

onExport2Click = function()
{
  return exportFile('Export2');
}

onExport3Click = function()
{
  return exportFile('Export3');
}

onExport4Click = function()
{
  return exportFile('Export4');
}

var pindex = 0;
var mogrify = '';
var ffmpeg = '';
var ffmpeglast = '';
var mainPath;
var docname = '';

var minLength = 3.5 // seconds
var maxLength = 10.0 // seconds
var defaultFps = 3.0

onSaveLayersClick = function()
{
  try {
    timingStart();
    var selectedLayers = app.activeDocument.selectedLayers();
    var path = settings.value('SaveLayers', 'path');
    var active = app.activeDocument;
    var parts = active.name.split(".");
    docname = parts[0];
    var newDoc = app.activeDocument.duplicate(String.random(8));

    if (active == newDoc) {
      return SUI.msg(SUI.ERROR, 'Save Layers', 'Could not make a duplicate.');
    }
    mainPath = addPathSep(File(addPathSep(path) + Path.simplename(docname)).fsName);
    var layers = getFlags(newDoc.listLayers());
    //takeScreenshotsFromLayers(layers);
    pindex = 0;
    mogrify = '';
    ffmpeg = '';
    ffmpeglast = '';
    handledSmart = [];
    saveLayersAsJpgs(layers, (selectedLayers.length > 1) ? selectedLayers : null);

    newDoc.close(SaveOptions.DONOTSAVECHANGES);
    app.activeDocument = active;
    timingStop('SaveLayers took');
    return SUI.msg(SUI.INFO, 'Save Layers', 'Layers saved to: ' + mainPath);
  } catch (e) {
    log(e);
  }
  return SUI.msg(SUI.ERROR, 'Save Layers', 'Saving layers failed.');
}

saveLayersAsJpgs = function(layers, selectedLayers)
{
  handleLayers(layers, saveJpg, selectedLayers);
}

saveJpg = function(layer)
{
  app.activeDocument.saveAsJpeg(output('layer-', '.jpg'), 3840, 2160);
}

getFlags = function(layers)
{
  for (var i = layers.length - 1; i >= 0; --i) {
    layers[i].layer.applyLocking(false, false, false, false);
    if (layers[i].visible) {
      layers[i].flags = flags(layers[i].layer);
    }
  }
  return layers;
}

hideAllLayers = function(layers, selectedLayers)
{
  var len = layers.length;

  for (var i = 0; i < len; ++i) {
    if (!(layers[i].layer.typename == 'LayerSet')) {
      if (!selectedLayers || selectedLayers.indexOf(layers[i].layer.name) > -1) {
        layers[i].layer.visible = false;
      }
    }
  }
}

output = function(prefix, suffix)
{
  var dir = checkDir();
  var name = dir + prefix + (++pindex).toString().padStart(4, '0') + suffix;
  ffmpeglast = 'file ' + name + '\n';
  ffmpeg += ffmpeglast;
  mogrify += name + '\n';
  return name;
}

checkDir = function()
{
  var s = addPathSep(File(mainPath).fsName);
  mkdir(s);
  return s;
}

// flags
// m = show with and without mask
// s = open smart object
// f = show with and without smart filters
// r = Show these first
// p = skip this layer
//
// Defaults
// PSB smart object => -m +s -f -r -p
// RAW smart object => -m -s -f -r -p
// Layer name == file name => +m +s +f +r -p
// Other layers => -m -s -f -r -p
//
// example (?ms) => show without mask and open smart object

default_flags = function(layer)
{
  if (layer.kind == LayerKind.SMARTOBJECT) {
    var info = layer.smartObjectInfo();
  } else {
    var info = false;
  }
  if (layer.name == docname) {
    var f = {
      mask: true,
      filter: true,
      smart: true,
      main: true,
      skip: false
    };
  } else if (info != false && info['type'] == 'photoshop') {
    var f = {
      mask: false,
      filter: false,
      smart: true,
      main: false,
      skip: false
    };
  } else {
    var f = {
      mask: false,
      filter: false,
      smart: false,
      main: false,
      skip: false
    };
  }
  return f;
}

flags = function(layer)
{
  var f = default_flags(layer);
  var n = layer.name.indexOf('(?');
  var v = true;
  if (n > 0) {
    n += 2
    while (n < layer.name.length) {
      if (layer.name[n] == '-') {
        v = false;
        ++n;
        continue;
      } if (layer.name[n] == '+') {
        v = true;
        ++n;
        continue;
      } else if (layer.name[n] == ')') {
        break;
      } else if (layer.name[n] == 'm') {
        f.mask = v;
      } else if (layer.name[n] == 'f') {
        f.filter = v;
      } else if (layer.name[n] == 's') {
        f.smart = v;
      } else if (layer.name[n] == 'r') {
        f.main = v;
      } else if (layer.name[n] == 'p') {
        f.skip = v;
      }
      v = true;
      ++n;
    }
  }
  //log(layer.name, f);
  return f;
}

enableLayerMasks = function(layers, n, enable)
{
  var i = n;
  var guard = 100;
  var hadMask = false;
  while (i != -1 && guard > 0) {
    if (layers[i].layer.enableMask(enable)) {
      hadMask = true;
    }
    i = layers[i].parent;
    --guard;
  }
  return hadMask;
}

handleLayer = function(layers, n, func)
{
  var layer = layers[n].layer;
  // layers[n].visible == original visibility
  // layer.visible == already handled
  if (layer.visible || !layers[n].visible) {
    return;
  }
  layer.visible = true;
  if (layers[n].flags.skip) {
    return;
  }
  //log(layer.name, layers[n].flags.smart, layer.visible, layers[n].visible, layers[n].flags.mask);
  if (layer.kind == LayerKind.SMARTOBJECT && layers[n].flags.smart) {
    var info = layer.smartObjectInfo();
    if (info) {
      if (info['type'] == 'photoshop') {
        if (layer.editSmartObjectContents()) {
          var smlayers = getFlags(app.activeDocument.listLayers());
          if (smlayers.length > 1) {
            handleLayers(smlayers, func);
          }
          app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        }
      } else if (info['type'] == 'raw') {
        if (layer.newSmartObjectViaCopy()) {
          //mainCopy = app.activeDocument.activeLayer;
          // if layer has layers clipped to it they clip to copy so use the org layer
          mainCopy = layer;
          layer = app.activeDocument.activeLayer;
          layers[n].layer = layer;
          // Move out of any groups
          mainCopy.move(activeDocument, ElementPlacement.PLACEATBEGINNING);
          mainCopy.deleteMask();
          mainCopy.removeSmartFilters(mainCopy);
          mainCopy.editSmartObjectContents(mainCopy);
          mainCopy.visible = true;
          mainCopy.opacity = 100;
          func.apply(this, [mainCopy]);
          mainCopy.remove();
        }
      }
    }
  }
  if (layer.typename == 'LayerSet') {
    if (layers[n].flags.mask) {
      if (enableLayerMasks(layers, n, false)) {
        func.apply(this, [layer]);
        enableLayerMasks(layers, n, true);
      }
    }
  } else {
    if (layers[n].flags.filter) {
      layer.enableSmartFilters(false);
    }
    if (layers[n].flags.mask) {
      enableLayerMasks(layers, n, false);
    }
    func.apply(this, [layer]);
    if (layers[n].flags.filter) {
      if (layer.enableSmartFilters(true)) {
        func.apply(this, [layer]);
      }
    }
    if (layers[n].flags.mask) {
      if (enableLayerMasks(layers, n, true)) {
        func.apply(this, [layer]);
      }
    }
  }
}

findFirst = function(layers, func)
{
  var result = [];

  for (var i = 0; i < layers.length; ++i) {
    if (layers[i].visible && layers[i].flags.main) {
      result.push(i);
    }
    //log(layers[i].layer.name, f.main);
  }
  return result;
}

handleLayers = function(layers, func, selectedLayers)
{
  var first = findFirst(layers);

  hideAllLayers(layers, selectedLayers);

  for (var i = first.length - 1; i >= 0; --i) {
    if (!selectedLayers || selectedLayers.indexOf(layers[i].layer.name) > -1) {
      handleLayer(layers, first[i], func);
    }
  }

  for (var i = layers.length - 1; i >= 0; --i) {
    if (!selectedLayers || selectedLayers.indexOf(layers[i].layer.name) > -1) {
      handleLayer(layers, i, func);
    }
  }

  var d = checkDir();
  writeTextFile(d + 'convert.txt', mogrify);
  writeTextFile(d + 'ffmpeg.txt', ffmpeg + ffmpeglast);

  var fname = Path.simplename(docname);
  var fr = 0;
  var n = pindex - 1;
  var insta = '-vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2" ';
  var fullhd = '-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" ';
  var fourk = '-vf "scale=3840:2160:force_original_aspect_ratio=decrease,pad=3840:2160:(ow-iw)/2:(oh-ih)/2" ';

  if (n / defaultFps < minLength) {
      fr = n / minLength;
  } else if (n / defaultFps > maxLength) {
      fr = n / maxLength;
  } else {
      fr = defaultFps;
  }
  cmd1 = '#!/bin/bash\nffmpeg -f concat -safe 0 -r ' +  fr + ' -i "' + d + 'ffmpeg.txt" ';
  cmd2 = '-c:v libx264 -r 30 -pix_fmt yuv420p "' + d + fname;
  writeTextFile(d + 'ffmpeg-org.sh', cmd1 + cmd2 + '.mp4"\n');
  writeTextFile(d + 'ffmpeg-4k.sh', cmd1 + fourk + cmd2 + '-4k.mp4"\n');
  writeTextFile(d + 'ffmpeg-1080p.sh', cmd1 + fullhd + cmd2 + '-1080p.mp4"\n');
  writeTextFile(d + 'ffmpeg-insta.sh', cmd1 + insta + cmd2 + '-insta.mp4"\n');
}

// Experimental
takeScreenshot = function(layer)
{
  app.activeDocument.activeLayer = layer;
  app.refresh();
  app.system("/usr/sbin/screencapture -x -m -T 0 " + output('screenshot-', '.png'));
}

takeScreenshotsFromLayers = function(layers)
{
  app.refresh();
  waitForRedraw();
  //alert('Waiting...');
  handleLayers(takeScreenshot);
}
