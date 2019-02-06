//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish - Color tab code
//
//**************************************************************************

ColorGrading = (function() {

return { // public:

currentThemeIndex: -1,
colorThemes: [],
colors: null,
previousTheme: null,

ColorGroupName: 'Color',
ColorLayers: ['Saturation', 'Selective Color', 'LUT', 'Tint', 'Curve',
               'Multi Color Tint', 'Color Balance'],

checkColorThemeGroup: function()
{
  //log('checkColorThemeGroup');
  var doc = app.activeDocument;
  var group = doc.checkGroup(this.ColorGroupName, undefined, 'Help Layers');
  var layer;

  layer = doc.checkLayer(this.ColorLayers[1], group);
  if (layer == null) {
    layer = doc.addSelectiveColorAdjustment(ColorLayers[1]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(this.ColorLayers[6], group);
  if (layer == null) {
    layer = doc.addColorBalanceAdjustment(ColorLayers[6]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(this.ColorLayers[2], group);
  if (layer == null) {
    layer = doc.addColorLookup(ColorLayers[2]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(this.ColorLayers[4], group);
  if (layer == null) {
    layer = doc.addCurveAdjustment(ColorLayers[4]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(this.ColorLayers[3], group);
  if (layer == null) {
    layer = doc.addSolidColorAdjustment(ColorLayers[3]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(this.ColorLayers[5], group);
  if (layer == null) {
    layer = doc.addGradientMapAdjustment(ColorLayers[5]);
  }
  layer.visible = false;
  layer.deleteMask();

  layer = doc.checkLayer(this.ColorLayers[0], group);
  if (layer == null) {
    layer = doc.addHueSaturationAdjustment(ColorLayers[0]);
  }
  layer.visible = false;
  layer.deleteMask();
  return group;
},
/*
const CurveChannels = {'master': 'Cmps', 'red': 'Rd  ', 'green': 'Grn ', 'blue': 'Bl  '};
const SelectiveColors = {'reds': 'Rds ', 'yellows': 'Ylws', 'greens': 'Grns',
                         'cyans': 'Cyns', 'blues': 'Bls ', 'magentas': 'Mgnt',
                         'whites': 'Whts', 'neutrals': 'Ntrl', 'blacks': 'Blks'};
const ColorBalance = {'shadows': 'ShdL', 'midtones': 'MdtL', 'highlights': 'HghL'};
*/
adjustValues: function(type, values, strength)
{
  var ret = null;
  //log(values);
  if (type == this.ColorLayers[0]) { // Saturation
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
  } else if (type == this.ColorLayers[1]) { // Selective Color
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
  } else if (type == this.ColorLayers[2]) { // LUT
    ret = values;
  } else if (type == this.ColorLayers[3]) { // Tint
    ret = values;
  } else if (type == this.ColorLayers[4]) { // Curve
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
  } else if (type == this.ColorLayers[5]) { // Gradient Map
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
  } else if (type == this.ColorLayers[6]) { // Color Balance
    ret = {};
    for (var i in ColorBalance) {
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
  }
  //log(ret);
  return ret;
},

checkColorThemes: function()
{
  if (this.colors == null) {
    var f = File(pluginPath + 'ui/js/colors.json');
    f.open('r');
    var content = f.read();
    f.close();
    this.colors = JSON.parse(content.substring(13));
    this.colorThemes = Object.keys(this.colors);
  }
}

};})();

setColorThemeStrength = function(strength)
{
  try {
    checkColorThemes();
    if (PreviousTheme == null) {
      PreviousTheme = ColorThemes[0];
    }
    setColorTheme(PreviousTheme, strength);
  } catch (e) {
    log(e);
  }
}

setColorTheme = function(data, strength)
{
  try {
    //log('setColorTheme', data, strength);
    var doc = app.activeDocument;
    var group = ColorGrading.checkColorThemeGroup();

    if (typeof data == 'string') {
      ColorGrading.checkColorThemes();
      ColorGrading.CurrentThemeIndex = ColorGrading.colorThemes.indexOf(data);
      ColorGrading.PreviousTheme = data;
      data = ColorGrading.colors[data];
    } else {
      ColorGrading.CurrentThemeIndex = -1;
      ColorGrading.PreviousTheme = data;
    }

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

    for (var i in ColorGrading.ColorLayers) {
      if (ColorGrading.ColorLayers[i] in data) {
        //log(ColorLayers[i], data[ColorLayers[i]]["adjust"], data['strength']);
        var layer = doc.findLayer(ColorGrading.ColorLayers[i], ColorGrading.ColorGroupName);
        var values = null;
        var opacity = ("opacity" in data[ColorGrading.ColorLayers[i]]) ?
                                    data[ColorGrading.ColorLayers[i]]["opacity"] : 100;
        layer.visible = true;
        if (data[ColorGrading.ColorLayers[i]]["adjust"] == 'values') {
          values = ColorGrading.adjustValues(ColorGrading.ColorLayers[i], data[ColorGrading.ColorLayers[i]]["values"], data['strength']);
          layer.opacity = opacity;
        } else if (data[ColorGrading.ColorLayers[i]]["adjust"] == 'opacity') {
          values = ColorGrading.adjustValues(ColorGrading.ColorLayers[i], data[ColorGrading.ColorLayers[i]]["values"], 100);
          layer.opacity = opacity * data['strength'] / 100;
        } else {
          values = ColorGrading.adjustValues(ColorGrading.ColorLayers[i], data[ColorGrading.ColorLayers[i]]["values"], 100);
          layer.opacity = opacity;
        }
        layer.setAdjustment(values);
        layer.setBlendingMode(data[ColorLayers[i]]['blendingmode']);
      }
    }
    app.activeDocument.activeLayer = group;

    if (ColorGrading.CurrentThemeIndex == -1) {
      setUI({"colorTheme": 'Random', "color": 0, "strength": data['strength']});
    } else {
      setUI({"colorTheme": ColorThemes[CurrentThemeIndex], "color": CurrentThemeIndex,
             "strength": data['strength']});
    }
  } catch (e) {
    log(e);
  }
}

onPrevColorClick = function()
{
  try {
    ColorGrading.checkColorThemes();
    var max = ColorGrading.colorThemes.length - 1;
    ColorGrading.currentThemeIndex = (ColorGrading.currentThemeIndex > 0) ?
                                      ColorGrading.currentThemeIndex - 1 : max;
    var theme = ColorGrading.colorThemes[ColorGrading.currentThemeIndex];
    setColorTheme(theme);
  } catch (e) {
    log(e);
  }
}

onRandomColorClick = function()
{
  try {
    var type = settings.value('RandomColor', 'type');

    ColorGrading.checkColorThemes();
    if (type == 0) {
      var max = ColorThemes.length - 1;
      var nclr = Math.floor(Math.random() * (max + 1));
      if (CurrentThemeIndex == nclr) {
        nclr = (nclr + 1) % (max + 1);
      }
      CurrentThemeIndex = nclr;
      var theme = ColorThemes[CurrentThemeIndex];
      setColorTheme(theme);
    } else {
      var r = Math.floor(Math.random() * 1024) + 1;
      var result = {};
      for (var i = 0; i < 7; ++i) {
        if (r & (1 << i)) {
          var start = Math.floor(Math.random() * ColorThemes.length);
          for (var j = start; j < ColorThemes.length; ++j) {
            var theme = ColorThemes[j % ColorThemes.length];
            if (ColorLayers[i] in Colors[theme]) {
              result[ColorLayers[i]] = Colors[theme][ColorLayers[i]];
              break;
            }
          }
        }
      }
      setColorTheme(result, Math.floor(Math.random() * 75) + 25);
    }
  } catch (e) {
    log(e);
  }
}

onNextColorClick = function()
{
  try {
    ColorGrading.checkColorThemes();
    var max = ColorGrading.colorThemes.length - 1;
    ColorGrading.currentThemeIndex = (ColorGrading.currentThemeIndex < max) ?
                                      ColorGrading.currentThemeIndex + 1 : 0;
    var theme = ColorGrading.colorThemes[ColorGrading.currentThemeIndex];
    setColorTheme(theme);
  } catch (e) {
    log(e);
  }
}
