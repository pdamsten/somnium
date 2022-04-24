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

ColorGrading = (function() {

var currentThemeIndex = -1;
var colorThemes = [];
var colors = null;
var previousTheme = null;

const ColorGroupName = 'Color';
const ColorLayers = ['Saturation', 'Selective Color', 'LUT', 'Tint', 'Curve',
                     'Multi Color Tint', 'Color Balance', 'Vibrance'];

return { // public:

checkColorThemeGroup: function()
{
  //log('checkColorThemeGroup');
  var doc = app.activeDocument;
  var group = doc.checkGroup(ColorGroupName, undefined, 'Help Layers');
  var layer;

  layer = doc.checkLayer(ColorLayers[1], group);
  if (layer == null) {
    layer = doc.addSelectiveColorAdjustment(ColorLayers[1]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(ColorLayers[6], group);
  if (layer == null) {
    layer = doc.addColorBalanceAdjustment(ColorLayers[6]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(ColorLayers[2], group);
  if (layer == null) {
    layer = doc.addColorLookup(ColorLayers[2]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(ColorLayers[4], group);
  if (layer == null) {
    layer = doc.addCurveAdjustment(ColorLayers[4]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(ColorLayers[3], group);
  if (layer == null) {
    layer = doc.addSolidColorAdjustment(ColorLayers[3]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(ColorLayers[5], group);
  if (layer == null) {
    layer = doc.addGradientMapAdjustment(ColorLayers[5]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(ColorLayers[0], group);
  if (layer == null) {
    layer = doc.addHueSaturationAdjustment(ColorLayers[0]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(ColorLayers[7], group);
  if (layer == null) {
    layer = doc.addVibranceAdjustment(ColorLayers[7]);
  }
  layer.visible = false;
  layer.deleteMask();

  return group;
},

adjustValues: function(type, values, strength)
{
  var ret = null;
  //log(values);
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
    for (var i in Adjustment.SelectiveColors) {
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
    for (var i in Adjustment.CurveChannels) {
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
  } else if (type == ColorLayers[6]) { // Color Balance
    ret = {};
    for (var i in Adjustment.ColorBalance) {
      if (i in values) {
        ret[i] = [];
        for (var j in values[i]) {
          ret[i][j] = values[i][j] * strength / 100;
        }
      } else {
        ret[i] = [0, 0, 0];
      }
    }
    if ('preserve luminosity' in values) {
      ret['preserve luminosity'] = values['preserve luminosity'];
    } else {
      ret['preserve luminosity'] = true;
    }
  } else if (type == ColorLayers[7]) { // Vibrance
    ret = {};
    ret = {};
    if ('vibrance' in values) {
      ret['vibrance'] = values['vibrance'] * strength / 100;
    } else {
      ret['vibrance'] = 0;
    }
    if ('saturation' in values) {
      ret['saturation'] = values['saturation'] * strength / 100;
    } else {
      ret['saturation'] = 0;
    }
  }
  //log(ret);
  return ret;
},

checkColorThemes: function()
{
  if (colors == null) {
    var f = File(pluginPath + 'ui/js/colors.json');
    f.open('r');
    var content = f.read();
    f.close();
    colors = JSON.parse(content.substring(13));
    colorThemes = Object.keys(colors);
  }
},

next: function()
{
  var max = colorThemes.length - 1;
  currentThemeIndex = (currentThemeIndex < max) ? currentThemeIndex + 1 : 0;
  return colorThemes[currentThemeIndex];
},

prev: function()
{
  var max = colorThemes.length - 1;
  currentThemeIndex = (currentThemeIndex > 0) ? currentThemeIndex - 1 : max;
  return colorThemes[currentThemeIndex];
},

random: function(type)
{
  if (type == 0) {
    var max = colorThemes.length - 1;
    var nclr = Math.floor(Math.random() * (max + 1));
    if (currentThemeIndex == nclr) {
      nclr = (nclr + 1) % (max + 1);
    }
    currentThemeIndex = nclr;
    return colorThemes[currentThemeIndex];
  } else {
    var r = Math.floor(Math.random() * 1024) + 1;
    var result = {};
    for (var i = 0; i < 7; ++i) {
      if (r & (1 << i)) {
        var start = Math.floor(Math.random() * colorThemes.length);
        for (var j = start; j < colorThemes.length; ++j) {
          var theme = colorThemes[j % colorThemes.length];
          if (ColorLayers[i] in colors[theme]) {
            result[ColorLayers[i]] = colors[theme][ColorLayers[i]];
            break;
          }
        }
      }
    }
    return result;
  }
},

colorData: function(data)
{
  if (typeof data == 'string') {
    if (data == 'previous') {
      if (previousTheme == null) {
        previousTheme = colorThemes[0];
      }
      data = previousTheme;
    }
    currentThemeIndex = colorThemes.indexOf(data);
    previousTheme = data;
    data = colors[data];
  } else {
    currentThemeIndex = -1;
  }
  return data;
},

colorLayer: function(name)
{
  return app.activeDocument.findLayer(name, ColorGroupName);
},

themeName: function()
{
  if (currentThemeIndex == -1) {
    return 'Random';
  } else {
    return colorThemes[currentThemeIndex];
  }
},

themeIndex: function()
{
  return currentThemeIndex;
}

};})();

onSetColorThemeStrength = function()
{
  try {
    strength = settings.value('SetColorThemeStrength', 'strength');
    setColorThemeStrength(strength);
  } catch (e) {
    log(e);
  }
}

setColorThemeStrength = function(strength)
{
  try {
    ColorGrading.checkColorThemes();
    setColorTheme('previous', strength);
  } catch (e) {
    log(e);
  }
}

onSetColorTheme = function()
{
  try {
    theme = settings.value('SetColorTheme', 'theme');
    setColorTheme(theme);
  } catch (e) {
    log(e);
  }
}

setColorTheme = function(data, strength)
{
  try {
    //log('setColorTheme', data, strength);
    if (data == 'Random') {
      onRandomColorClick();
      return;
    }
    ColorGrading.checkColorThemes();
    var doc = app.activeDocument;
    var group = ColorGrading.checkColorThemeGroup();
    data = ColorGrading.colorData(data);

    if (strength == undefined) {
      if (!('strength' in data)) {
        if ('default' in data) {
          data['strength'] = data['default'];
        } else {
          data['strength'] = 50;
        }
      }
    } else {
      data['strength'] = parseInt(strength);
    }

    for (var key in data) {
      if (["default", "strength"].indexOf(key) > -1) {
        continue;
      }
      //log(ColorLayers[i], data[ColorLayers[i]]["adjust"], data['strength']);
      var layer = ColorGrading.colorLayer(key);
      var values = null;
      var opacity = ("opacity" in data[key]) ? data[key]["opacity"] : 100;
      var fill = ("fill" in data[key]) ? data[key]["fill"] : 100;
      layer.visible = true;
      if (data[key]["adjust"] == 'values') {
        values = ColorGrading.adjustValues(key, data[key]["values"], data['strength']);
        layer.opacity = opacity;
        layer.fillOpacity = fill;
      } else if (data[key]["adjust"] == 'opacity') {
        values = ColorGrading.adjustValues(key, data[key]["values"], 100);
        layer.opacity = opacity * data['strength'] / 100;
        layer.fillOpacity = fill;
      } else if (data[key]["adjust"] == 'fill') {
        values = ColorGrading.adjustValues(key, data[key]["values"], 100);
        layer.opacity = opacity;
        layer.fillOpacity = fill * data['strength'] / 100;
      } else {
        values = ColorGrading.adjustValues(key, data[key]["values"], 100);
        layer.opacity = opacity;
        layer.fillOpacity = fill;
      }
      layer.setAdjustment(values);
      layer.setBlendingMode(data[key]['blendingmode']);
    }
    app.activeDocument.activeLayer = group;

    SUI.setElements({"colorTheme": ColorGrading.themeName(), "color": ColorGrading.themeIndex(),
                    "strength": data['strength']});
  } catch (e) {
    log(e);
  }
}

onPrevColorClick = function()
{
  try {
    ColorGrading.checkColorThemes();
    setColorTheme(ColorGrading.prev());
  } catch (e) {
    log(e);
  }
}

onRandomColorClick = function()
{
  try {
    ColorGrading.checkColorThemes();
    var type = settings.value('RandomColor', 'type');
    setColorTheme(ColorGrading.random(type), Math.floor(Math.random() * 75) + 25);
  } catch (e) {
    log(e);
  }
}

onNextColorClick = function()
{
  try {
    ColorGrading.checkColorThemes();
    setColorTheme(ColorGrading.next());
  } catch (e) {
    log(e);
  }
}
