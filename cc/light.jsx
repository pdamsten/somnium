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

onMakeCookieClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var type = settings.value('MakeCookie', 'type');

    if (type == 0) {
      var c = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, -15), Adjustment.curvePoint(255, 0)];
      l = doc.addCurveAdjustment('Cookie');
      l.move(current, ElementPlacement.PLACEBEFORE);
      l.setAdjustment(c);
      l.setBlendingMode('luminosity');
    } else {
      var c = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, 15), Adjustment.curvePoint(255, 0)];
      l = doc.addCurveAdjustment('Cookie');
      l.move(current, ElementPlacement.PLACEBEFORE);
      l.setAdjustment(c);
      l.invertMask();
      l.setBlendingMode('luminosity');
    }
  } catch (e) {
    log(e);
  }
}

onMakeSpotlightClick = function(data)
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var p = 0.2;
    var width = app.activeDocument.width.as("px");
    var height = app.activeDocument.height.as("px");
    if (width > height) {
      v = height / 2;
    } else {
      v = width / 2;
    }
    var c = [v - v * p, v - v * p, v + v * p, v + v * p];
    doc.makeSelection('new', 0, c, 0.5);
    l = doc.addSolidColorAdjustment('Spot Light', [255, 255, 255]);
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.setMaskFeather(v * 0.1);
    l.opacity = 75;
    l.setBlendingMode('soft light');
  } catch (e) {
    log(e);
  }
}

onMakeVignetteOK = function(data)
{
  try {
    if (typeof data == "string") {
      data = JSON.parse(data);
      settings.saveDlgValues(data);
    }
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var type = data['items']['type']['value'];
    var p = 0.1;
    var width = app.activeDocument.width.as("px");
    var height = app.activeDocument.height.as("px");
    var c = [height * p, width * p, height - height * p, width - width * p];
    doc.makeSelection('new', type, c, 0.5);
    var c = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, -20),
             Adjustment.curvePoint(255, 0)];
    l = doc.addCurveAdjustment('Vignette');
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.setAdjustment(c);
    l.invertMask();
    l.setMaskFeather(width * 0.1);
    l.setBlendingMode('luminosity');
  } catch (e) {
    log(e);
  }
}

onMakeVignetteClick = function()
{
  try {
    vignetteDlg = {
      'title': 'Vignette',
      "items": {
        "type": {
          "title": "Style:",
          "type": "selection",
          "value": 0,
          "values": ["Elliptical", "Rectangular"]
        }
      },
      'callback': 'onMakeVignetteOK'
    };
    settings.loadDlgValues(vignetteDlg);

    var type = settings.value('MakeVignette', 'type');
    if (type == 2) {
      SUI.openDialog(vignetteDlg);
    } else {
      vignetteDlg['items']['type']['value'] = type;
      onMakeVignetteOK(vignetteDlg);
    }
  } catch (e) {
    log(e);
  }
}

onMakeWashOutClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var c = [Adjustment.curvePoint(0, 5), Adjustment.curvePoint(32, 0),
             Adjustment.curvePoint(224, 0), Adjustment.curvePoint(255, -2.5)];

    l = doc.addCurveAdjustment('Faded / Contrast');
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.setCurveAdjustment(c);
    l.deleteMask();
    l.setBlendingMode('luminosity');
  } catch (e) {
    log(e);
  }
}

onMakeDBClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var type = settings.value('MakeDB', 'type');

    if (type == 1) {
      var l = doc.addLayer('Dodge & Burn');
      l.move(current, ElementPlacement.PLACEBEFORE);
      l.fill('gray');
      l.setBlendingMode('overlay');
      Photoshop.selectTool('burn');
    } else {
      var group = doc.addGroup('Dodge & Burn');
      group.move(current, ElementPlacement.PLACEBEFORE);
      var b = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, -30),
               Adjustment.curvePoint(255, 0)];
      var d = [Adjustment.curvePoint(0, 0), Adjustment.curvePoint(128, 30),
               Adjustment.curvePoint(255, 0)];
      var dl = doc.addCurveAdjustment('Dodge', group);
      var bl = doc.addCurveAdjustment('Burn', group);
      dl.setAdjustment(d);
      bl.setAdjustment(b);
      dl.invertMask();
      bl.invertMask();
      dl.setBlendingMode('luminosity');
      bl.setBlendingMode('luminosity');
      Photoshop.setDefaultColors();
      group.activate();;
      Photoshop.selectTool('brush'); // TODO brush preset?
    }
  } catch (e) {
    log(e);
  }
}

onQuickDBClickOK = function(data)
{
  try {
    if (typeof data == "string") {
      data = JSON.parse(data);
    }
    settings.saveDlgValues(data);
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var layer = doc.stampCurrentAndBelow('Quick Dodge and Burn');
    layer.desaturate();
    if (data['items']['type']['value'] == 0) {
      layer.setBlendingMode('soft light');
    } else {
      layer.setBlendingMode('vivid light');
    }
    layer.applyHighPassEx(200, false);
    layer.opacity = 50;
    layer.addMask();
    layer.invertMask();
    layer.move(current, ElementPlacement.PLACEBEFORE);
  } catch (e) {
    log(e);
  }
}

onQuickDBClick = function()
{
  try {
    dbDlg = {
      'title': 'Quick Dodge and Burn',
      "items": {
        "type": {
          "title": "Strength:",
          "type": "selection",
          "value": 0,
          "values": ["Normal (Soft Light)", "Strong (Vivid Light)"]
        }
      },
      'callback': 'onQuickDBClickOK'
    };
    settings.loadDlgValues(dbDlg);
    SUI.openDialog(dbDlg);
  } catch (e) {
    log(e);
  }
}

onQuickBoostClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    l = doc.addChannelMixer('Quick Boost');
    l.setChannelMixer([-30, 60, 80], 0, true);
    l.setBlendingMode('soft light');
    l.opacity = 30;
    l.deleteMask(l);
  } catch (e) {
    log(e);
  }
}

onMakeHighlightClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var l = doc.addSolidColorAdjustment('Hightlight')
    l.move(current, ElementPlacement.PLACEBEFORE);
    l.setAdjustment([255, 255, 255]);
    l.setBlendingMode('soft light');
    l.addMask();
    l.invertMask();
  } catch (e) {
    log(e);
  }
}

const GlowStyle = {
  'outerGlow': {
    'blendingmode': 'screen',
    'opacity': 92,
    'noise': 3,
    'color': [255, 255, 255],
    'technique': 'softer',
    'spread': 3,
    'size': 6,
    'contour': "Half Round",
    'anti-aliased': false,
    'range': 100,
    'jitter': 0
  }
};

onMakeLightSourceClick = function()
{
  try {
    var advb = {'transparencyShapesLayer': false};
    var doc = app.activeDocument;
    var current = doc.activeLayer;
    var group = doc.addGroup('Light Source');
    group.move(current, ElementPlacement.PLACEBEFORE);
    var l1 = doc.addLayer('Light', group, ElementPlacement.INSIDE);
    l1.setAdvancedBlending(advb);
    l1.setBlendingMode('color dodge');
    doc.activeLayer = group; // otherwise empty layer gets replaced by solid color adjustment
    var l2 = doc.addSolidColorAdjustment('Glow');
    l2.setAdjustment([234, 213, 168]);
    l2.invertMask();
    l2.setBlendingMode('overlay');
    var l3 = doc.addSolidColorAdjustment('Particles');
    l3.setAdjustment([249, 219, 128]);
    l3.invertMask();
    l3.setBlendingMode('screen');
    l3.setStyles(GlowStyle);
    l3.fillOpacity = 50
  } catch (e) {
    log(e);
  }
}

onMakeLuminosityClick = function()
{
  try {
    var doc = app.activeDocument;
    var current = doc.activeLayer;

    var group = doc.addGroup('Luminosity');
    group.move(current, ElementPlacement.PLACEBEFORE);
    group.addMask(true);

    var lum = doc.addCurveAdjustment('Luminosity', group);
    lum.deleteMask();
    lum.setBlendingMode('luminosity');

    var sat = doc.addHueSaturationAdjustment('Saturation', group);
    sat.deleteMask();

  } catch (e) {
    log(e);
  }
}
