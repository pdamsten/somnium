//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Retouch tab code
//
//**************************************************************************

onDefringeMaskClick = function()
{
  var layer = app.activeDocument.activeLayer;
  if (layer.activateMask()) {
    layer.applyGaussianBlurEx(2.0);
    layer.adjustLevelsEx([[180, 255, 1.0], [0, 255]]);
  } else {
    return UI.msg(UI.WARNING, 'Defringe Mask', 'No Layer mask.');
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

onCombineDocumentsClick = function()
{
  try {
    var doc = app.activeDocument;
    var moved = false;
    for (var i = app.documents.length - 1; i >= 0; --i) {
      if (app.documents[i] != doc) {
        if (app.documents[i].layers.length == 1) {
          app.activeDocument = app.documents[i];
          app.documents[i].layers[0].duplicateToDoc(doc.name);
          app.documents[i].close(SaveOptions.DONOTSAVECHANGES);
          moved = true;
        }
      }
    }
    app.activeDocument = doc;
    if (moved == false) {
      return UI.msg(UI.WARNING, 'Combine Documents', 'Could not find any single layer documents.');
    }
  } catch (e) {
    log(e);
  }
}

onFillEmptyClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = app.activeDocument.activeLayer;
    var stamp = doc.stampCurrentAndBelow();
    if (!doc.hasSelection()) {
      stamp.alphaToSelection();
    }
    doc.selection.invert();
    doc.expandSelection(2);
    stamp.activate();
    doc.contentAwareFill();
    stamp.duplicateEx('Fill');
    stamp.remove();
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

onMakeLuminosityClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;

    var group = doc.addGroup('Luminosity');
    group.move(current, ElementPlacement.PLACEBEFORE);
    group.addMask(true);

    var lum = doc.addCurveAdjustment('Luminosity', group);
    lum.deleteMask();
    lum.setBlendingMode('luminosity');

    var sat = doc.addHueSaturationAdjustment('Saturation', group);
    sat.deleteMask();

  } catch (e) {
    log(e);
  }
}

onMakeFSClick = function()
{
  try {
    var doc = app.activeDocument;
    var type = settings.value('MakeFS', 'style');
    var lo = doc.stampCurrentAndBelow('Low Frequence');
    var hi = lo.duplicateEx('High Frequence');
    var layers = [];
    hi.visible = false;
    lo.applyGaussianBlurEx(7.0);
    layers.push(lo);
    hi.visible = true;
    var params = ["RGB", "Low Frequence", 'subtract', 2, 128];
    hi.applyImage(params, false);
    hi.setBlendingMode('linear light');
    layers.push(hi);
    if (type == 1) { // With helper
      var lo2 = lo.duplicateEx('Low Frequence Blurred');
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
