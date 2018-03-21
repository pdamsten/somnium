//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish - Color tab code
//
//**************************************************************************

onSaturationClick = function(type)
{
  try {
    var group = checkGroup('Color', 'Finish', 'Help Layers');
    var l = createHueSaturationAdjustment('Saturation', group);
    deleteLayerMask(l);
  } catch (e) {
    log(e);
  }
}

onColorClick = function(type)
{
  try {
    var group = checkGroup('Color', 'Finish', 'Help Layers');
    var l = createSelectiveColorAdjustment('Color Grading', group);
    deleteLayerMask(l);
  } catch (e) {
    log(e);
  }
}

onTintClick = function(type)
{
  try {
    var group = checkGroup('Color', 'Finish', 'Help Layers');
    var l = createSolidColorAdjustment('Tint', group, [0, 0, 128]);
    l.opacity = 15;
    setLayerBlendingMode(l, 'color');
    deleteLayerMask(l);
  } catch (e) {
    log(e);
  }
}
