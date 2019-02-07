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
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var layer = doc.stampCurrentAndBelow('High Pass Sharpening');
    layer.convertToSmartObject();
    layer.move(current, ElementPlacement.PLACEBEFORE);
    layer.applyHighPassEx(2.6, false);
    layer.setBlendingMode('hard light');
  } catch (e) {
    log(e);
  }
}

onAddNoiseClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var layer = doc.addSolidColorAdjustment('Noise', [128, 128, 128]);
    layer.convertToSmartObject();
    layer.deleteMask();
    layer.move(current, ElementPlacement.PLACEBEFORE);
    layer.applyAddNoiseEx(2.0, 'gaussian', true, false);
    layer.applyGaussianBlurEx(0.4, false);
    layer.setBlendingMode('overlay');
  } catch (e) {
    log(e);
  }
}
