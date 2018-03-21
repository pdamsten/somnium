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

    $('select, input').each(function(index, obj) {
      var s = localStorage.getItem($(this).attr('id') + 'Value');
      if (s) {
        $(this).val(s);
      }
    });
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
    $(".experimental").css("display", "initial"); // TODO from ini
    initJsx();
    themeManager.init();
    showTab(localStorage.getItem('currentTab') || 'Retouch');

    // Handle all clickable elements
    $(".clickable").click(function () {
      var params = [];
      var id = $(this).attr('id');
      var n = id.indexOf('_');
      if (n > 0) {
        id = id.substring(0, n);
      }
      $("[id^=" + id + "Param]").each(function(index, obj) {
        params.push('"' + $(this).val() + '"');
      });
      var fn = 'on' + $(this).attr('id') + 'Click(' + params.join(',') + ')';
      csInterface.evalScript(fn, function(result) {
        if (result) {
          $("[id^=" + id + "Param]").each(function(index, obj) {
            $(this).val(result);
            localStorage.setItem($(this).attr('id') + 'Value', this.value);
          });
        }
      });
    });

    $('select, input').on('change', function() {
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
