// Responsible for overwriting CSS at runtime according to CC app settings as defined by the
// end user. Modified from Creative Cloud Extension Builder for Brackets boilerplate.

var themeManager = (function () {
  'use strict';

  var pscolors = {50: [41, 214, 38, 125, 225],
                  83: [69, 221, 66, 125, 240],
                  184: [209, 37, 163, 135, 15],
                  240: [252, 43, 219, 173, 41]};

  // Convert the Color object to string in hexadecimal format;
  function toHex(color, delta)
  {
    function computeValue(value)
    {
      value = value.toString(16);
      return value.length === 1 ? "0" + value : value;
    }

    var hex = "";
    if (color) {
      hex = computeValue(color.red, delta) + computeValue(color.green, delta) +
            computeValue(color.blue, delta);
    }
    return hex;
  }

  function hexColor(v)
  {
    return '#' + toHex({red: v, green: v, blue: v}, 0) + ';';
  }

  function addRule(stylesheetId, selector, rule)
  {
    console.log(stylesheetId, selector, rule);
    var stylesheet = document.getElementById(stylesheetId);
    if (stylesheet) {
      stylesheet = stylesheet.sheet;
      if (stylesheet.addRule) {
        stylesheet.addRule(selector, rule);
      } else if (stylesheet.insertRule) {
        stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
      }
    }
  }

  function nearest(bg)
  {
    var v = bg.color.red;
    var d = 255;
    var k = 0;

    for (var i in pscolors) {
      if (Math.abs(i - v) < d) {
        d = Math.abs(i - v);
        k = i;
      }
    }
    return k;
  }

  // Update the theme with the AppSkinInfo retrieved from the host product.
  function updateThemeWithAppSkinInfo(appSkinInfo)
  {
    try {
      var styleId = "ccstyles";
      var clr = nearest(appSkinInfo.panelBackgroundColor);
      var fs = appSkinInfo.baseFontSize + 'px;';
      var ff = appSkinInfo.baseFontFamily.replace('.', '') + ',-apple-system,system-ui,sans-serif;';
      var bg = hexColor(appSkinInfo.panelBackgroundColor.color.red);
      var widgetBg = hexColor(pscolors[clr][0]);
      var txt = hexColor(pscolors[clr][1]);
      var darkerBg = hexColor(pscolors[clr][2]);
      var buttonPressed = hexColor(pscolors[clr][3]);
      var widgetTxt = hexColor(pscolors[clr][4]);
      var brightnessFilter = pscolors[clr][1] / 255.0;
      addRule(styleId, ".cc", "background-color:" + bg);
      addRule(styleId, ".cc", "color:" + txt);
      addRule(styleId, ".cc", "font-size:" + fs);
      addRule(styleId, ".cc", "font-family:" + ff);
      addRule(styleId, ".ccbutton", "border-color:" + buttonPressed);
      addRule(styleId, ".ccbutton", "background:" + bg);
      addRule(styleId, ".ccbutton", "color:" + widgetTxt);
      addRule(styleId, ".ccbutton:active", "border-color:" + buttonPressed);
      addRule(styleId, ".ccbutton:active", "background:" + buttonPressed);
      addRule(styleId, ".ccbutton:active", "color:" + darkerBg);
      addRule(styleId, ".ccbuttondefault", "border-color:" + widgetTxt);
      addRule(styleId, ".ccbuttondefault", "background:" + bg);
      addRule(styleId, ".ccbuttondefault", "color:" + widgetTxt);
      addRule(styleId, ".ccbuttondefault:active", "border-color:" + widgetTxt);
      addRule(styleId, ".ccbuttondefault:active", "background:" + widgetTxt);
      addRule(styleId, ".ccbuttondefault:active", "color:" + darkerBg);
      addRule(styleId, ".ccwidget", "background-color:" + widgetBg);
      addRule(styleId, ".ccwidget", "color:" + txt);
      addRule(styleId, ".ccheader", "background-color:" + darkerBg);
      addRule(styleId, ".ccheader", "border-color:" + darkerBg);
      addRule(styleId, ".ccheader", "color:" + txt);
      addRule(styleId, ".ccsvg", "filter:brightness(" + brightnessFilter + ');');
    } catch(err) {
      alert(err.message);
    }
  }

  function onAppThemeColorChanged(event)
  {
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    updateThemeWithAppSkinInfo(skinInfo);
  }

  function init()
  {
    var csInterface = new CSInterface();

    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
  }

  return {
    init: init
  };
}());
