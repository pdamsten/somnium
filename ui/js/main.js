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
    csInterface.evalScript('init("' + jsxPath + '")');
  }

  function showTab(name)
  {
    $(".tab").hide();
    $("#" + name + "Tab").show();
    $(".tabbtnselected").removeClass('tabbtnselected');
    $("#" + name).addClass('tabbtnselected');
    localStorage.setItem('currentTab', name);
  }

  function init()
  {
    initJsx();
    themeManager.init();
    showTab(localStorage.getItem('currentTab') || 'Retouch');

    // Handle all clickable elements
    $(".clickable").click(function () {
      var fn = 'on' + $(this).attr('id') + 'Click()';
      csInterface.evalScript(fn);
    });

    $(".tabbtn").click(function () {
      showTab($(this).attr('id'));
    });

    $("#Info").click(function () {
      $('.help').slideToggle();
    });
  }

  init();

}());
