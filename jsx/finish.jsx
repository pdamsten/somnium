//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//  Copyright (c) 2018-2020 by Petri Damstén <petri.damsten@gmail.com>
//
//  This file is part of Somnium.
//
//  Somnium is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  Foobar is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with Somnium.  If not, see <https://www.gnu.org/licenses/>.
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

onHighPassSharpeningClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var layer = doc.stampCurrentAndBelow('High Pass Sharpening');
    layer = layer.convertToSmartObject();
    layer.move(current, ElementPlacement.PLACEBEFORE);
    layer.applyHighPassEx(2.6, false);
    layer.setBlendingMode('hard light');
    return layer;
  } catch (e) {
    log(e);
  }
  return null;
}

onAddNoiseClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var layer = doc.addSolidColorAdjustment('Noise', [128, 128, 128]);
    layer = layer.convertToSmartObject();
    layer.deleteMask();
    layer.move(current, ElementPlacement.PLACEBEFORE);
    layer.applyAddNoiseEx(2.0, 'gaussian', true, false);
    layer.applyGaussianBlurEx(0.4, false);
    layer.setBlendingMode('overlay');
  } catch (e) {
    log(e);
  }
}
