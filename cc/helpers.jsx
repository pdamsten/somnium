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

const helpGroupName = 'Help Layers';
const grey50 = [128, 128, 128];
const MemoStyles = {
  'colorOverlay': {
    'color': [255, 0, 55],
    'opacity': 100,
    'blendingmode': 'normal'
  },
  'stroke': {
    'size': 2,
    'position': 'outside',
    'blendingmode': 'normal',
    'opacity': 100,
    'overprint': false,
    'color': [0, 0, 0]
  }
}

onMakeAllClick = function()
{
  try {
    onMakeSaturationMapClick();
    onMatchTonesClick();
    onMakeLightnessClick();
    onMakeSkinCheckerClick();
    onMakeSolarisationClick();
    onMakePerspectiveLinesClick();
    onMakeMemoClick();
  } catch (e) {
    log(e);
  }
}

onBlendIfClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var l = doc.addSolidColorAdjustment('Blend If Helper');
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.grouped = true; // Clipping mask
    l.setAdjustment([255, 0, 0]);
    l.opacity = 50;
    l.deleteMask(l);
  } catch (e) {
    log(e);
  }
}

onMakeSolarisationClick = function()
{
  try {
    var doc = app.activeDocument;
    doc.pushLayer();
    l = doc.checkLayer('Solarisation', helpGroupName)
    if (l == null) {
      var c = [[0, 0], [26,225], [73,30], [109, 225], [145, 30], [182, 225], [219, 30], [255, 255]];

      group = doc.checkGroup(helpGroupName);
      l = doc.addCurveAdjustment('Solarisation');
      l.setAdjustment(c);
      l.deleteMask();
      l.visible = false;
    }
    if (!l.visible) { l.parent.visible = true; }
    l.visible = !l.visible;
    doc.popLayer();
  } catch (e) {
    log(e);
  }
}

onMakeMemoClick = function()
{
  try {
    var doc = app.activeDocument;
    doc.pushLayer();
    l = doc.checkLayer('Memo', helpGroupName);
    if (l == null) {
      var group = doc.checkGroup(helpGroupName);
      var layer = doc.addLayer('Memo', group, ElementPlacement.INSIDE);
      layer.setStyles(MemoStyles);
      layer.opacity = 66;
      layer.visible = false;
      l = layer;
    }
    if (!l.visible) { l.parent.visible = true; }
    l.visible = !l.visible;
    if (!l.visible) {
      doc.popLayer();
    }
  } catch (e) {
    log(e);
  }
}

onMakeSkinCheckerClick = function()
{
  try {
    var doc = app.activeDocument;
    doc.pushLayer();
    l = doc.checkLayer('Skin Checker', helpGroupName);
    if (l == null) {
      group = doc.checkGroup(helpGroupName);
      l = doc.addChannelMixer('Skin Checker');
      l.setChannelMixer([-46, 4, 200], 0, true);
      l.deleteMask(l);
      l.visible = false;
    }
    if (!l.visible) { l.parent.visible = true; }
    l.visible = !l.visible;
    doc.popLayer();
  } catch (e) {
    log(e);
  }
}

onMakePerspectiveLinesClick = function()
{
  try {
    var doc = app.activeDocument;
    doc.pushLayer();
    l = doc.checkLayer('Perspective Lines', helpGroupName);
    if (l == null) {
      var group = doc.checkGroup(helpGroupName);
      var v = Math.max(app.activeDocument.width, app.activeDocument.height);
      var a = 15;
      var l;
      var layers = [];

      for (var i = 0; i < 12; ++i) {
        var n = 'Line ' + (i + 1);
        l = doc.drawLine(n, 0, v/2, v, v/2, 0.2);
        l.rotate(i * 15.0);
        l.scale(5);
        layers.push(l);
      }
      var perspective = doc.groupLayers('Perspective Lines', layers);
      l.visible = false;
    }
    if (!l.visible) { l.parent.visible = true; }
    l.visible = !l.visible;
    doc.popLayer();
  } catch (e) {
    log(e);
  }
}

onMakeLightnessClick = function()
{
  try {
    var doc = app.activeDocument;
    doc.pushLayer();
    l = doc.checkLayer('Luminosity Check', helpGroupName);
    if (l == null) {
      var group = doc.checkGroup(helpGroupName);
      var l1 = doc.addSolidColorAdjustment('Luminosity', grey50);
      var l2 = doc.addCurveAdjustment('Enhance');
      l1.setBlendingMode('color');
      l2.setAdjustment(Adjustment.scurve(10));
      l1.deleteMask();
      l2.deleteMask();
      l = doc.groupLayers('Luminosity Check', [l1, l2]);
      l2.visible = false;
      l.visible = false;
    }
    if (!l.visible) { l.parent.visible = true; }
    l.visible = !l.visible;
    doc.popLayer();
  } catch (e) {
    log(e);
  }
}

onMatchTonesClick = function()
{
  try {
    var doc = app.activeDocument;
    doc.pushLayer();
    l = doc.checkLayer('Hue Check', helpGroupName);
    if (l == null) {
      var group = doc.checkGroup(helpGroupName);
      var l1 = doc.addSolidColorAdjustment('Hue', grey50);
      var l2 = doc.addHueSaturationAdjustment('Enhance');
      l1.setBlendingMode('luminosity');
      l2.setHueSaturationAdjustment(0, 100, 0);
      l1.deleteMask();
      l2.deleteMask();
      l = doc.groupLayers('Hue Check', [l1, l2]);
      l.visible = false;
    }
    if (!l.visible) { l.parent.visible = true; }
    l.visible = !l.visible;
    doc.popLayer();
  } catch (e) {
    log(e);
  }
}

onMakeSaturationMapClick = function()
{
  try {
    var doc = app.activeDocument;
    doc.pushLayer();
    l = doc.checkLayer('Saturation Check', helpGroupName);
    if (l == null) {
      var group = doc.checkGroup(helpGroupName);
      var l = doc.addSelectiveColorAdjustment('Saturation Check', group);
      var values = {'reds':   [0, 0, 0, -100], 'yellows':  [0, 0, 0, -100],
                    'greens': [0, 0, 0, -100], 'cyans':    [0, 0, 0, -100],
                    'blues':  [0, 0, 0, -100], 'magentas': [0, 0, 0, -100],
                    'whites': [0, 0, 0,  100], 'neutrals': [0, 0, 0, 100],
                    'blacks': [0, 0, 0,  100], 'mode': 'absolute'};
      l.setAdjustment(values);
      l.deleteMask();
      l.visible = false;
    }
    if (!l.visible) { l.parent.visible = true; }
    l.visible = !l.visible;
    doc.popLayer();
  } catch (e) {
    log(e);
  }
}

onDeleteAllClick = function()
{
  try {
    var group = app.activeDocument.findGroup(helpGroupName)
    if (group != null) {
      group.remove();
    }
  } catch (e) {
    log(e);
  }
}
