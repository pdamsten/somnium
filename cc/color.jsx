//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish - Color tab code
//
//**************************************************************************

const ColorGroupName = 'Color';
const ColorLayers = ['Saturation', 'Selective Color', 'LUT', 'Tint', 'Curve', 'Multi Color Tint'];

checkColorThemeGroup = function()
{
  //log('checkColorThemeGroup');
  var group = checkGroup(ColorGroupName);
  var layer;

  layer = checkLayer(ColorLayers[1], group);
  if (layer == null) {
    layer = createSelectiveColorAdjustment(ColorLayers[1], group);
  }
  layer.visible = false;
  deleteLayerMask(layer);

  layer = checkLayer(ColorLayers[2], group);
  if (layer == null) {
    layer = createColorLookup(ColorLayers[2], group);
  }
  layer.visible = false;
  deleteLayerMask(layer);

  layer = checkLayer(ColorLayers[4], group);
  if (layer == null) {
    layer = createCurveAdjustment(ColorLayers[4], group);
  }
  layer.visible = false;
  deleteLayerMask(layer);

  layer = checkLayer(ColorLayers[3], group);
  if (layer == null) {
    layer = createSolidColorAdjustment(ColorLayers[3], group);
  }
  layer.visible = false;
  deleteLayerMask(layer);

  layer = checkLayer(ColorLayers[5], group);
  if (layer == null) {
    layer = createGradientMapAdjustment(ColorLayers[5], group);
  }
  layer.visible = false;
  deleteLayerMask(layer);

  layer = checkLayer(ColorLayers[0], group);
  if (layer == null) {
    layer = createHueSaturationAdjustment(ColorLayers[0], group);
  }
  layer.visible = false;
  deleteLayerMask(layer);
}

const CurveChannels = {'master': 'Cmps', 'red': 'Rd  ', 'green': 'Grn ', 'blue': 'Bl  '};
const SelectiveColors = {'reds': 'Rds ', 'yellows': 'Ylws', 'greens': 'Grns',
                         'cyans': 'Cyns', 'blues': 'Bls ', 'magentas': 'Mgnt',
                         'whites': 'Whts', 'neutrals': 'Ntrl', 'blacks': 'Blks'};

adjustValues = function(type, values, strength)
{
  var ret = null;
  log(values);
  if (type == ColorLayers[0]) { // Saturation
    ret = {};
    if ("colorize" in values) {
      ret["colorize"] = values["colorize"];
    } else {
      ret["colorize"] = false;
    }
    if ("master" in values) {
      ret["master"] = [];
      for (var j in values["master"]) {
        ret["master"][j] = values["master"][j] * strength / 100;
      }
    } else {
      ret["master"] = [0, 0, 0];
    }
    ret["ranges"] = [];
    for (var i = 0; i < 6; ++i) {
      ret["ranges"][i] = [];
      if (typeof values["ranges"] !== 'undefined' && typeof values["ranges"][i] !== 'undefined') {
        for (var j in values["ranges"][i]) {
          if (j < 3) {
            ret["ranges"][i][j] = values["ranges"][i][j] * strength / 100;
          } else {
            ret["ranges"][i][j] = values["ranges"][i][j];
          }
        }
      } else {
        ret["ranges"][i] = [0, 0, 0, 100, 120, 240, 260];
      }
    }
  } else if (type == ColorLayers[1]) { // Selective Color
    ret = {};
    for (var i in SelectiveColors) {
      if (i in values) {
        ret[i] = [];
        for (var j in values[i]) {
          ret[i][j] = values[i][j] * strength / 100;
        }
      } else {
        ret[i] = [0, 0, 0, 0];
      }
    }
  } else if (type == ColorLayers[2]) { // LUT
    ret = values;
  } else if (type == ColorLayers[3]) { // Tint
    ret = values;
  } else if (type == ColorLayers[4]) { // Curve
    ret = {};
    for (var i in CurveChannels) {
      if (i in values) {
        ret[i] = [];
        for (var j in values[i]) {
          ret[i][j] = [];
          ret[i][j][0] = values[i][j][0];
          ret[i][j][1] = (values[i][j][1] - values[i][j][0])
              * strength / 100 + values[i][j][0];
        }
      } else {
        ret[i] = [[0, 0], [255, 255]];
      }
    }
  } else if (type == ColorLayers[5]) { // Gradient Map
    ret = {};
    if ('colors' in values) {
      ret['colors'] = [];
      for (i in values['colors']) {
        ret['colors'][i] = values['colors'][i];
      }
    } else {
      ret['colors'] = [[0, 0, 0, 0, 50], [255, 255, 255, 255, 50]];
    }
    if ('opacity' in values) {
      ret['opacity'] = [];
      for (i in values['opacity']) {
        ret['opacity'][i] = values['opacity'][i];
      }
    } else {
      ret['opacity'] = [[100, 0, 50], [100, 100, 50]];
    }
  }
  log(ret);
  return ret;
}

setAdjustmentLayer = function(layer, type, values)
{
  if (type == ColorLayers[0]) { // Saturation
    setHueSaturationAdjustment(layer, values);
  } else if (type == ColorLayers[1]) { // Selective Color
    setSelectiveColorAdjustment(layer, values);
  } else if (type == ColorLayers[2]) { // LUT
    setColorLookup(layer, values);
  } else if (type == ColorLayers[3]) { // Tint
    setSolidColorAdjustment(layer, values);
  } else if (type == ColorLayers[4]) { // Curve
    setCurveAdjustment(layer, values);
  } else if (type == ColorLayers[5]) { // Multi Color Tint
    setGradientMapAdjustment(layer, values);
  }
}

onColorThemeChanged = function(values)
{
  try {
    //log('onColorThemeChanged');
    checkColorThemeGroup();

    var data = JSON.parse(values);

    for (var i in ColorLayers) {
      if (ColorLayers[i] in data) {
        //log(ColorLayers[i], data[ColorLayers[i]]["adjust"], data['strength']);
        var layer = findLayer(ColorLayers[i], ColorGroupName);
        var values = null;
        layer.visible = true;
        if (data[ColorLayers[i]]["adjust"] == 'values') {
          values = adjustValues(ColorLayers[i], data[ColorLayers[i]]["values"], data['strength']);
        } else if (data[ColorLayers[i]]["adjust"] == 'opacity') {
          values = adjustValues(ColorLayers[i], data[ColorLayers[i]]["values"], 100);
          layer.opacity = data['strength'];
        } else {
          values = adjustValues(ColorLayers[i], data[ColorLayers[i]]["values"], 100);
        }
        setAdjustmentLayer(layer, ColorLayers[i], values);
        log(data[ColorLayers[i]]['blendingmode']);
        setLayerBlendingMode(layer, data[ColorLayers[i]]['blendingmode']);
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
