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
    $("#tabTitle").html($("#" + name).attr('data-title'));
    localStorage.setItem('currentTab', name);
  }

  function init()
  {
    initJsx();
    csInterface.evalScript('isDebug()', function(result) {
      if (result == 'true') { // Yes string after eval
        $(".experimental").css("display", "inline-block");
      }
    });
    themeManager.init();
    showTab(localStorage.getItem('currentTab') || 'Retouch');

    $('#helpSettings').click(function() {
      $('#helpSettings').slideToggle();
    });

    // Handle all clickable elements
    $("#settings").on("click", ".clickable", function (e) {
      var type = $(this).data("type");
      var fn;
      var id;
      var params = [];

      if (type == "folderBrowse") {
        fn = 'BrowseFolder';
        params.push('"' + $(this).data("title") + '"');
        id = $(this).data("id");
        params.push('"' + $('#' + id).val() + '"');
      }
      fn = 'on' + fn + 'Click(' + params.join(',') + ')';

      csInterface.evalScript(fn, function(result) {
        if (result != 'null') {
          $('#' + id).val(result);
        }
      });
      e.stopPropagation();
    });

    // Handle icon buttons
    $(".iconButton").click(function () {
      if ($("#helpSettings").is(":visible")) {
        $('#helpSettings').slideToggle();
      }
      fn = 'on' + fn + 'Click()';

      csInterface.evalScript(fn, function(result) {
        if (result != 'undefined') { // Yes string after eval
          $('#helpSettings').slideToggle();
          $('#helpHeader').html('Message');
          $('#helpText').html(result);
          $('#settingsHeader').hide();
          $('#settings').hide();
        }
      });
    });

    // Handle icon button right click
    $('.iconButton').contextmenu(function() {
      var id = $(this).attr('id');
      $('#helpHeader').html(Settings[id]['title']);
      $('#helpText').html(Settings[id]['help']);

      if ('config' in Settings[id]) {
        $('#settingsHeader').show();
        $('#settings').show();
        var html = '';
        for (var key in Settings[id]['config']) {
          if (Settings[id]['config'][key]['type'] == 'folder') {
            var fn = 'settings.value("' + id + '","' + key + '");'
            csInterface.evalScript(fn, function(result) {
              var value = result;
              html += Settings[id]['config'][key]['title'] + '<br/>';
              html += '<div class="multicolumn"><div class="column greedy">';
              html += '<input id="' + id + '-' + key + '" class="ccwidget" value="' + value + '">';
              html += '</div><div class="column">';
              html += '<button data-title="' + Settings[id]['config'][key]['title'] +
                      '" data-type="folderBrowse" data-id="' + id + '-' + key +
                      '" class="ccwidget ccbuttonsmall clickable">Browse</button><br/>';
              html += '</div></div>';
              $('#settings').html(html);
            });
          }
        }
      } else {
        $('#settingsHeader').hide();
        $('#settings').hide();
      }
      if (!$("#helpSettings").is(":visible")) {
        $('#helpSettings').slideToggle();
      }
      return false;
    });

    $('select, input').on('change', function() {
      localStorage.setItem($(this).attr('id') + 'Value', this.value);
    });

    $(".tabbtn").click(function () {
      showTab($(this).attr('id'));
    });
  }

  init();

}());
