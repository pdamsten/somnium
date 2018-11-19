//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish - Color tab code
//
//**************************************************************************

var colorGroupName = 'Color';

checkColorGroup = function()
{
  var group = checkGroup(colorGroupName);
  var layer;

  layer = checkLayer('Saturation', group);
  if (layer == null) {
    layer = createHueSaturationAdjustment('Saturation', group);
  }
  layer.visible = false;

  layer = checkLayer('Selective Color', group);
  if (layer == null) {
    layer = createSelectiveColorAdjustment('Selective Color', group);
  }
  layer.visible = false;
}

onColorThemeChanged = function(values, strength, adjust)
{
  log(values, strength, adjust);
  try {
    checkColorGroup();
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
