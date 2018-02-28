//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Main javascript file in ui side.
//
//**************************************************************************

(function () {
  'use strict';

  var csInterface = new CSInterface();

  function initJsx()
  {
    var jsxPath = csInterface.getSystemPath(SystemPath.EXTENSION) + '/cc/';
    //console.log(jsxPath);
    csInterface.evalScript('init("' + jsxPath + '")');
  }

  function init()
  {
    initJsx();
    themeManager.init();

    // Handle all clickable elements
    $(".clickable").click(function () {
      var fn = 'on' + $(this).attr('id') + 'Click()';
      csInterface.evalScript(fn);
    });
    $("#Info").click(function () {
      $('.help').slideToggle();
    });
  }

  init();

}());
