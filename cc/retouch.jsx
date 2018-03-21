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
