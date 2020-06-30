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

onDefringeMaskClick = function()
{
  var layer = app.activeDocument.activeLayer;
  if (layer.activateMask()) {
    layer.applyGaussianBlurEx(2.0);
    layer.adjustLevelsEx([[180, 255, 1.0], [0, 255]]);
  } else {
    return SUI.msg(SUI.WARNING, 'Defringe Mask', 'No Layer mask.');
  }
}

onMakeCleaningClick = function()
{
  try {
    var layer = app.activeDocument.addLayer('Cleaning');
    layer.applyLocking(false, false, true, false);
  } catch (e) {
    log(e);
  }
}

function docsCompare(a, b)
{
  return (a.name).localeCompare(b.name);
}

onCombineDocumentsClick = function()
{
  try {
    var doc = app.activeDocument;
    var docs = [];
    for (var i = 0; i < app.documents.length; ++i) {
      if (app.documents[i] != doc) {
        if (app.documents[i].layers.length == 1) {
          docs.push(app.documents[i]);
        }
      }
    }
    docs.sort(docsCompare);
    for (var i = 0; i < docs.length; ++i) {
      app.activeDocument = docs[i];
      docs[i].layers[0].duplicateToDoc(doc.name);
      docs[i].close(SaveOptions.DONOTSAVECHANGES);
    }
    app.activeDocument = doc;
    if (docs.length == 0) {
      return SUI.msg(SUI.WARNING, 'Combine Documents', 'Could not find any single layer documents.');
    }
  } catch (e) {
    log(e);
  }
}

onFillEmptyClick = function()
{
  try {
    var type = settings.value('FillEmpty', 'style');
    var doc = app.activeDocument;
    var current = app.activeDocument.activeLayer;
    var stamp = doc.stampCurrentAndBelow();
    if (!doc.hasSelection()) {
      stamp.alphaToSelection();
      doc.selection.invert();
      doc.expandSelection(2);
    }
    stamp.activate();
    if (type == 0) { // Auto
      doc.contentAwareFill();
      stamp.duplicateEx('Fill');
    } else {
      SUI.msg(SUI.INFO, 'Content Aware Fill', 'Please leave "Output To:" to "New Layer"')
      doc.contentAwareFillDialog();
      app.activeDocument.activeLayer.name = 'Fill';
    }
    stamp.remove();
    app.activeDocument.clearSelection();
  } catch (e) {
    log(e);
  }
}

onBlendIf2MaskClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var copy = current.duplicate();
    copy = copy.rasterizeEx();
    var empty = doc.addLayer();
    copy = doc.mergeLayers([copy, empty]);
    copy.alphaToSelection();
    copy.remove();
    current.addMask();
    current.setBlendIf([[0, 0, 255, 255, 0, 0, 255, 255], [0, 0, 255, 255, 0, 0, 255, 255],
                        [0, 0, 255, 255, 0, 0, 255, 255], [0, 0, 255, 255, 0, 0, 255, 255]]);
  } catch (e) {
    log(e);
  }
}

onMakeMatchClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;

    var lum = doc.addCurveAdjustment('Luminosity');
    lum.deleteMask();
    lum.move(current, ElementPlacement.PLACEBEFORE);
    lum.setBlendingMode('luminosity');
    lum.grouped = true;

    var hue = doc.addSelectiveColorAdjustment('Hue');
    hue.deleteMask();
    hue.move(lum, ElementPlacement.PLACEBEFORE);
    hue.grouped = true;

    var sat = doc.addHueSaturationAdjustment('Saturation');
    sat.deleteMask();
    sat.move(hue, ElementPlacement.PLACEBEFORE);
    sat.grouped = true;

    // Helpers
    onMakeLightnessClick();
    onMatchTonesClick();
    onMakeSaturationMapClick();
    app.activeDocument.activeLayer = current;
  } catch (e) {
    log(e);
  }
}

onMakeFSClick = function()
{
  try {
    var doc = app.activeDocument;
    var type = settings.value('MakeFS', 'style');
    var lo = doc.stampCurrentAndBelow('Low Frequence (?+p)');
    var hi = lo.duplicateEx('High Frequence');
    var layers = [];
    hi.visible = false;
    lo.applyGaussianBlurEx(7.0);
    layers.push(lo);
    hi.visible = true;
    var params = ["RGB", "Low Frequence (?+p)", 'subtract', 2, 128];
    hi.applyImage(params, false);
    hi.setBlendingMode('linear light');
    layers.push(hi);
    if (type == 1) { // With helper
      var lo2 = lo.duplicateEx('Low Frequence Blurred (?+p)');
      lo2.applyGaussianBlurEx(9.0);
      layers.push(lo2);
    }
    var g = doc.groupLayers('Frequence Separation', layers);
    if (type == 1) {
      g.addMask(true);
    }
  } catch (e) {
    log(e);
  }
}

stampWithSelection = function()
{
  try {
    var layer = app.activeDocument.stampCurrentAndBelow('Stamp from below');
    if (app.activeDocument.hasSelection()) {
      app.activeDocument.selection.invert();
      app.activeDocument.selection.clear();
      app.activeDocument.selection.invert();
    }
    app.activeDocument.clearSelection();
    return layer;
  } catch (e) {
    log(e);
  }
}

onStampUnderClick = function(type)
{
  try {
    stampWithSelection();
  } catch (e) {
    log(e);
  }
}

onSmartFromUnderClick = function(type)
{
  try {
    var layer = stampWithSelection();
    layer.convertToSmartObject();
  } catch (e) {
    log(e);
  }
}

onUpdateFromUnderClick = function(type)
{
  try {
    var orgLayer = app.activeDocument.activeLayer;
    var info = orgLayer.smartObjectInfo();
    if (info != false) {
      if (info['fileref'].endsWith(".psb")) {
        var orgDoc = app.activeDocument;
        orgLayer.visible = false;
        var stamp = app.activeDocument.stampCurrentAndBelow('update');
        if (orgLayer.editSmartObjectContents()) {
          var newDoc = app.activeDocument;
          var newLayer = app.activeDocument.activeLayer;
          if (newDoc.layers.length == 1) {
            app.activeDocument = orgDoc;
            stamp.duplicateToDoc(newDoc.name);
            stamp.remove();
            app.activeDocument = newDoc;
            newLayer.remove();
            newDoc.close(SaveOptions.SAVECHANGES);
            app.activeDocument = orgDoc;
          } else {
            newDoc.close();
            app.activeDocument = orgDoc;
            stamp.remove();
          }
        }
      }
    }
  } catch (e) {
    log(e);
  }
}

onSmartKeepingMaskClick = function(type)
{
  try {
    var doc = app.activeDocument;
    var layer = doc.activeLayer;
    var name = layer.name + ' - layer mask';
    var hasMask = layer.hasMask();
    if (hasMask) {
      layer.saveMask(name);
      layer.deleteMask();
    }
    layer = layer.convertToSmartObject();
    if (hasMask) {
      layer.loadMask(name);
    }
  } catch (e) {
    log(e);
  }
}
