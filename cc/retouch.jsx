//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Retouch tab code
//
//**************************************************************************

onDefringeMaskClick = function()
{
  if (selectLayerMask(app.activeDocument.activeLayer)) {
    doGaussianBlur(app.activeDocument.activeLayer, 2.0);
    doLevels(app.activeDocument.activeLayer, [[180, 255, 1.0], [0, 255]]);
  } else {
    return msg(WARNING, 'Defringe Mask', 'No Layer mask.');
  }
}

onMakeCleaningClick = function()
{
  try {
    var layer = createLayer('Cleaning');
    applyLocking(layer, false, false, true, false);
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
          duplicateLayerToDoc(app.documents[i].layers[0], doc.name);
          //log(app.documents[i].name, doc.name);
          app.documents[i].close(SaveOptions.DONOTSAVECHANGES);
          moved = true;
        }
      }
    }
    app.activeDocument = doc;
    if (moved == false) {
      return msg(WARNING, 'Combine Documents', 'Could not find any single layer documents.');
    }
  } catch (e) {
    log(e);
  }
}

onFillEmptyClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;
    var stamp = stampCurrentAndBelow(current, randomString(10));
    selectLayer(current);
    inverseSelection();
    expandSelection(2);
    app.activeDocument.activeLayer = stamp;
    contentAwareFill();
    duplicateLayer(stamp, 'Fill');
    stamp.remove();
  } catch (e) {
    log(e);
  }
}

onBlendIf2MaskClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;
    var copy = duplicateLayer(current);
    copy = rasterizeLayer(copy);
    var empty = createLayer();
    copy = mergeLayers([copy, empty]);
    selectLayer(copy);
    copy.remove();
    addLayerMask(current);
    setBlendIf(current, [[0, 0, 255, 255, 0, 0, 255, 255], [0, 0, 255, 255, 0, 0, 255, 255],
                         [0, 0, 255, 255, 0, 0, 255, 255], [0, 0, 255, 255, 0, 0, 255, 255]]);
  } catch (e) {
    log(e);
  }
}

onMakeMatchClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;

    var lum = createCurveAdjustment('Luminosity');
    deleteLayerMask(lum);
    lum.move(current, ElementPlacement.PLACEBEFORE);
    lum.grouped = true;

    var hue = createSelectiveColorAdjustment('Hue');
    deleteLayerMask(hue);
    hue.move(lum, ElementPlacement.PLACEBEFORE);
    hue.grouped = true;

    var sat = createHueSaturationAdjustment('Saturation');
    deleteLayerMask(sat);
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
    var type = settings.value('MakeFS', 'style');
    /* Not sure if this simple is useful after all
      var layer = stampCurrentAndBelow('current', 'Simple Frequence Separation');
      invertLayer(layer);
      layer = convertToSmartObject(layer);
      doHighPass(layer, 24, false);
      doGaussianBlur(layer, 7.0, false);
      setLayerBlendingMode(layer, 'vivid light');
      addLayerMask(layer, true);
    */
    var lo = stampCurrentAndBelow('current', 'Low Frequence');
    var hi = duplicateLayer(lo, 'High Frequence');
    var layers = [];
    hi.visible = false;
    doGaussianBlur(lo, 7.0);
    layers.push(lo);
    hi.visible = true;
    var params = ["RGB", "Low Frequence", 'subtract', 2, 128];
    doApplyImage(hi, params, false);
    setLayerBlendingMode(hi, 'linear light');
    layers.push(hi);
    if (type == 1) { // With helper
      var lo2 = duplicateLayer(lo, 'Low Frequence Blurred');
      doGaussianBlur(lo2, 9.0);
      layers.push(lo2);
    }
    var g = groupLayers('Frequence Separation', layers);
    if (type == 1) {
      addLayerMask(g, true);
    }
  } catch (e) {
    log(e);
  }
}

onStampUnderClick = function(type)
{
  try {
    stampCurrentAndBelow('current', 'Stamp from below');
  } catch (e) {
    log(e);
  }
}

onSmartFromUnderClick = function(type)
{
  try {
    var layer = stampCurrentAndBelow('current', 'Stamp from below');
    convertToSmartObject(layer);
  } catch (e) {
    log(e);
  }
}

onUpdateFromUnderClick = function(type)
{
  try {
    var info = smartObjectInfo(app.activeDocument.activeLayer);
    if (info != false) {
      if (endsWith(info['fileref'], ".psb")) {
        var orgDoc = app.activeDocument;
        var orgLayer = app.activeDocument.activeLayer;
        orgLayer.visible = false;
        var stamp = stampCurrentAndBelow(orgLayer, 'update');
        if (editSmartObjectContents(orgLayer)) {
          var newDoc = app.activeDocument;
          var newLayer = app.activeDocument.activeLayer;
          if (newDoc.layers.length == 1) {
            app.activeDocument = orgDoc;
            duplicateLayerToDoc(stamp, newDoc.name);
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
