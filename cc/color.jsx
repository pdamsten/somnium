//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish - Color tab code
//
//**************************************************************************

var colorGroupName = 'Color';
var supported = ['Saturation', 'Selective Color', 'LUT', 'Tint', 'Curve'];

checkColorThemeGroup = function()
{
  //log('checkColorThemeGroup');
  var group = checkGroup(colorGroupName);
  var layer;

  layer = checkLayer(supported[1], group);
  if (layer == null) {
    layer = createSelectiveColorAdjustment(supported[1], group);
  }
  layer.visible = false;

  layer = checkLayer(supported[2], group);
  if (layer == null) {
    layer = createColorLookup(supported[2], group);
  }
  layer.visible = false;

  layer = checkLayer(supported[3], group);
  if (layer == null) {
    layer = createSolidColorAdjustment(supported[3], group);
  }
  layer.visible = false;

  layer = checkLayer(supported[4], group);
  if (layer == null) {
    layer = createCurveAdjustment(supported[4], group);
  }
  layer.visible = false;

  layer = checkLayer(supported[0], group);
  if (layer == null) {
    layer = createHueSaturationAdjustment(supported[0], group);
  }
  layer.visible = false;
}

adjustValues = function(values, strength)
{
  if (type == supported[0]) { // Saturation

  } else if (type == supported[1]) { // Selective Color

  } else if (type == supported[2]) { // LUT

  } else if (type == supported[3]) { // Tint
    return values;
  } else if (type == supported[4]) { // Curve

  }
  return values;
}

setAdjustmentLayer = function(layer, type, values)
{
  if (type == supported[0]) { // Saturation
    setHueSaturationAdjustment(layer, values);
  } else if (type == supported[1]) { // Selective Color
    setSelectiveColorAdjustment(layer, values);
  } else if (type == supported[2]) { // LUT
    setColorLookup(layer, values);
  } else if (type == supported[3]) { // Tint
    setSolidColorAdjustment(layer, values);
  } else if (type == supported[4]) { // Curve
    setCurveAdjustment(layer, values);
  }
}

onColorThemeChanged = function(values)
{
  try {
    //log('onColorThemeChanged');
    checkColorThemeGroup();

    var data = JSON.parse(values);

    for (i in supported) {
      if (supported[i] in data) {
        log(supported[i]);
        var layer = findLayer(supported[i], colorGroupName);
        layer.visible = true;
        if (data[supported[i]].adjust == 'values') {
          var values = adjustValues(data[supported[i]], data['strength']);
        } else {
          var values = data[supported[i]];
          layer.opacity = data['strength'];
        }
        log(values[0]);
        setAdjustmentLayer(layer, supported[i], values);
        setLayerBlendingMode(layer, data['blendingmode']);
      }
    }
    /*
    var lookup = "/Applications/Adobe Photoshop CC 2019/Presets/3DLUTs/Bleach Bypass.look";
    var lookup = pluginPath + "assets/AquaAndBrown.cube";
    var group = checkGroup('Color', 'Finish', 'Help Layers');
    var layer = createColorLookup('test');
    setColorLookup(layer, lookup);
    */
  } catch (e) {
    log(e);
  }
}
