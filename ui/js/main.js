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
    $('select').each(function(index, obj) {
      $(this).val(localStorage.getItem($(this).attr('id') + 'Value') || 'normal');
    });
  }

  function init()
  {
    initJsx();
    themeManager.init();
    showTab(localStorage.getItem('currentTab') || 'Retouch');

    // Handle all clickable elements
    $(".clickable").click(function () {
      var params = [];
      $("[id^=" + $(this).attr('id') + "Param]").each(function(index, obj) {
        params.push('"' + $(this).val() + '"');
      });
      var fn = 'on' + $(this).attr('id') + 'Click(' + params.join(',') + ')';
      csInterface.evalScript(fn);
    });

    $('select').on('change', function() {
      localStorage.setItem($(this).attr('id') + 'Value', this.value);
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
