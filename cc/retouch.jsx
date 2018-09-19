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
    msg('No Layer mask.');
  }
}

onMakeCleaningClick = function()
{
  var layer = createLayer('Cleaning');
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

onMakeMatchClick = function()
{
  try {
    var layer;
    layer = createCurveAdjustment('Luminosity');
    deleteLayerMask(layer);
    clipBelow(layer);
    layer = createSelectiveColorAdjustment('Hue');
    deleteLayerMask(layer);
    clipBelow(layer);
    layer = createHueSaturationAdjustment('Saturation');
    deleteLayerMask(layer);
    clipBelow(layer);
    // Helpers
    onMakeLightnessClick();
    onMatchTonesClick();
    onMakeSaturationMapClick();
  } catch (e) {
    log(e);
  }
}

onMakeFSClick = function(type)
{
  try {
    if (type == 'simple') {
      var layer = stampCurrentAndBelow('current', 'Simple Frequency Separation');
      invertLayer(layer);
      setLayerBlendingMode(layer, 'vividLight');
      doHighPass(layer, 24);
      doGaussianBlur(layer, 4);
      addLayerMask(layer, true);
    } else {
      var lo = stampCurrentAndBelow('current', 'Low Frequency');
      var hi = duplicateLayer(lo, 'High Frequency');
      hi.visible = false;
      doGaussianBlur(lo, 7.0);
      hi.visible = true;
      var params = ["RGB", "Low Frequency", 'subtract', 2, 128];
      doApplyImage(hi, params, false);
      setLayerBlendingMode(hi, 'linearLight');
      var lo2 = duplicateLayer(lo, 'Low Frequency paint');
      doGaussianBlur(lo2, 9.0);
      addLayerMask(lo2, true);
      groupLayers('Frequency Separation', [hi, lo2, lo]);
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
