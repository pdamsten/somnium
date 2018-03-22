//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish - Color tab code
//
//**************************************************************************

onSaturationClick = function()
{
  try {
    var group = checkGroup('Color', 'Finish', 'Help Layers');
    var l = createHueSaturationAdjustment('Saturation', group);
    deleteLayerMask(l);
  } catch (e) {
    log(e);
  }
}

onColorClick = function()
{
  try {
    var group = checkGroup('Color', 'Finish', 'Help Layers');
    var l = createSelectiveColorAdjustment('Color Grading', group);
    deleteLayerMask(l);
  } catch (e) {
    log(e);
  }
}

onTintClick = function(color)
{
  try {
    var rgb = color.substring(4, color.length - 1).replace(/ /g, '').split(',');
    var group = checkGroup('Color', 'Finish', 'Help Layers');
    var l = createSolidColorAdjustment('Tint', group, rgb);
    l.opacity = 15;
    setLayerBlendingMode(l, 'color');
    deleteLayerMask(l);
  } catch (e) {
    log(e);
  }
}
