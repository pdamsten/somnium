// Responsible for overwriting CSS at runtime according to CC app
// settings as defined by the end user.
// modified from Creative Cloud Extension Builder for Brackets boilerplate

var themeManager = (function () {
  'use strict';
     
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
    return '#' + toHex({red: v, green: v, blue: v}, 0);
  }
  
  function addRule(stylesheetId, selector, rule) 
  {
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
        
  // Update the theme with the AppSkinInfo retrieved from the host product.
  function updateThemeWithAppSkinInfo(appSkinInfo) 
  {
    var pscolors = {50: [41, 214, 38], 
                    83: [69, 221, 66], 
                    184: [209, 37, 163], 
                    240: [252, 43, 219]};
    var styleId = "ccstyles";
    var fs = appSkinInfo.baseFontSize + "px;";
    var ff = appSkinInfo.baseFontFamily;
    var bg = hexColor(appSkinInfo.panelBackgroundColor.color.red);
    var bgw = hexColor(pscolors[appSkinInfo.panelBackgroundColor.color.red][0]);
    var bgh = hexColor(pscolors[appSkinInfo.panelBackgroundColor.color.red][2]);
    var txt = hexColor(pscolors[appSkinInfo.panelBackgroundColor.color.red][1]);
    var txtp = pscolors[appSkinInfo.panelBackgroundColor.color.red][1] / 255.0;
    addRule(styleId, ".cc", "background-color:" + bg);
    addRule(styleId, ".cc", "color:" + txt);
    addRule(styleId, ".cc", "font-size:" + fs);
    addRule(styleId, ".cc", "font-family:" + ff);
    addRule(styleId, ".ccwidget", "background-color:" + bgw);
    addRule(styleId, ".ccwidget", "color:" + txt);
    addRule(styleId, ".ccheader", "background-color:" + bgh);
    addRule(styleId, ".ccheader", "color:" + txt);
    addRule(styleId, ".svg", "filter:brightness(" + txtp + ')');
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
