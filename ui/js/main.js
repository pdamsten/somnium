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

  var setValue = function(id, key, type)
  {
    var data = {
      'id': id,
      'key': key,
      'type': type
    };

    return function(result) {
      if (data['type'] == 'folder') {
        $('#' + data['id'] + '-' + data['key']).val(result);
      }
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

    $('body').click(function() {
      if ($("#helpSettings").is(":visible")) {
        $('#helpSettings').slideToggle();
      }
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
          var a = id.split('-');
          var fn = 'settings.value("' + a[0] + '","' + a[1] + '","' + $('#' + id).val() + '");'
          csInterface.evalScript(fn);
        }
      });
      e.stopPropagation();
    });

    $("#helpSettings").on("click", "*", function (e) {
      e.stopPropagation();
    });

    $("#settings").on('change', "input", function(e) {
      var a = $(this).attr('id').split('-');
      var fn = 'settings.value("' + a[0] + '","' + a[1] + '","' + this.value + '");'
      csInterface.evalScript(fn);
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
        $('#settings').show();
        var html = '';
        for (var key in Settings[id]['config']) {
          var type = Settings[id]['config'][key]['type'];
          if (type == 'folder') {
            html += Settings[id]['config'][key]['title'] + '<br/>';
            html += '<div class="multicolumn"><div class="column greedy">';
            html += '<input id="' + id + '-' + key + '" class="ccwidget" value="">';
            html += '</div><div class="column">';
            html += '<button data-title="' + Settings[id]['config'][key]['title'] +
                    '" data-type="folderBrowse" data-id="' + id + '-' + key +
                    '" class="ccwidget ccbuttonsmall clickable">Browse</button><br/>';
            html += '</div></div>';
            var fn = 'settings.value("' + id + '","' + key + '");'
            csInterface.evalScript(fn, setValue(id, key, type));
          } else if (type == 'pixelsize') {
            html += Settings[id]['config'][key]['title'] + '<br/>';
          } else if (type == 'color') {
            html += Settings[id]['config'][key]['title'] + '<br/>';
          }
        }
        $('#settingsText').html(html);
      } else {
        $('#settings').hide();
      }
      if (!$("#helpSettings").is(":visible")) {
        $('#helpSettings').slideToggle();
      }
      return false;
    });

    $(".tabbtn").click(function () {
      showTab($(this).attr('id'));
    });
  }

  init();

}());
