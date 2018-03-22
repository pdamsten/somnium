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
  var pluginPath = '';

  function initJsx()
  {
    pluginPath = csInterface.getSystemPath(SystemPath.EXTENSION) + '/';
    csInterface.evalScript('init("' + pluginPath + '")');

    $('select, input, .colorPicker').each(function(index, obj) {
      var s = localStorage.getItem($(this).attr('id') + 'Value');
      if (s) {
        setValue(this, s);
      }
    });
  }

  function setValue(item, v)
  {
    if ($(item).hasClass("colorPicker")) {
      $(item).css('background-color', v);
    } else {
      $(item).val(v);
    }
  }

  function getValue(item)
  {
    if ($(item).hasClass("colorPicker")) {
      return $(item).css('background-color');
    } else {
      return $(item).val();
    }
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
    csInterface.evalScript('isDebug()', function(result) {
      if (result == 'true') { // Yes string after eval
        $(".experimental").css("display", "initial");
      }
    });
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
      var fn = '';
      if ($(this).hasClass("colorPicker")) {
        fn = 'ColorPicker';
        params.push('"' + getValue(this) + '"');
      } else {
        $("[id^=" + id + "Param]").each(function(index, obj) {
          params.push('"' + getValue(this) + '"');
        });
        fn = $(this).attr('id');
      }
      fn = 'on' + fn + 'Click(' + params.join(',') + ')';

      csInterface.evalScript(fn, function(result) {
        if (result != 'undefined') { // Yes string after eval
          if (id.indexOf('Param') < 0) {
            id += 'Param';
          }
          $("[id^=" + id + "]").each(function(index, obj) {
            setValue(this, result);
            localStorage.setItem($(this).attr('id') + 'Value', result);
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
