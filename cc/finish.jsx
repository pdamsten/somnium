//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish tab code
//
//**************************************************************************

onHighPassSharpeningClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;
    var layer = stampCurrentAndBelow('current', 'High Pass Sharpening');
    layer = convertToSmartObject(layer);
    layer.move(current, ElementPlacement.PLACEBEFORE);
    doHighPass(layer, 2.6, false);
    setLayerBlendingMode(layer, 'hard light');
  } catch (e) {
    log(e);
  }
}

onAddNoiseClick = function()
{
  try {
    var current = app.activeDocument.activeLayer;
    var layer = createSolidColorAdjustment('Noise', 'current', [128, 128, 128]);
    layer = convertToSmartObject(layer);
    deleteLayerMask(layer);
    layer.move(current, ElementPlacement.PLACEBEFORE);
    addNoise(layer, 2.0, 'gaussian', true, false);
    doGaussianBlur(layer, 0.4, false);
    setLayerBlendingMode(layer, 'overlay');
  } catch (e) {
    log(e);
  }
}
