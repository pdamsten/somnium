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
      } else if (data['type'] == 'color') {
        $('#' + data['id'] + '-' + data['key']).css('background-color', result);
      } else if (data['type'] == 'pixelsize') {
        var a = result.split('x');
        $('#' + data['id'] + '-' + data['key'] + '_x').val(a[0]);
        $('#' + data['id'] + '-' + data['key'] + '_y').val(a[1]);
      } else if (data['type'] == 'selection') {
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

  function input(id, cls, type)
  {
    cls = (cls == undefined) ? '': ' ' + cls;
    type = (type == undefined) ? '': ' data-type="' + type + '" ';
    return '<input id="' + id + '" class="ccwidget ' + cls + '" value=""' + type + '>';
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
    $("#settingsText").on("click", ".clickable", function (e) {
      var type = $(this).data("type");
      var fn;
      var id;
      var params = [];

      if (type == "folderBrowse") {
        fn = 'BrowseFolder';
        params.push('"' + $(this).data("title") + '"');
        id = $(this).data("id");
        params.push('"' + $('#' + id).val() + '"');
      } else if (type == "color") {
        fn = 'ColorPicker';
        id = $(this).attr('id');
        params.push('"' + $(this).css('background-color') + '"');
      }

      fn = 'on' + fn + 'Click(' + params.join(',') + ')';

      csInterface.evalScript(fn, function(result) {
        if (result != 'null') {
          var a = id.split('-');
          if (type == "folderBrowse") {
            $('#' + id).val(result);
          } else if (type == "color") {
            $('#' + id).css('background-color', result)
          }
          var fn = 'settings.value("' + a[0] + '","' + a[1] + '","' + result + '");'
          csInterface.evalScript(fn);
        }
      });
      e.stopPropagation();
    });

    $("#helpSettings").on("click", "#helpHeader, #closeDlg", function (e) {
      if ($("#helpSettings").is(":visible")) {
        $('#helpSettings').slideToggle();
      }
    });

    $("#helpSettings").on("click", "*", function (e) {
      e.stopPropagation();
    });

    $("#settingsText").on('change', "input, select", function(e) {
      var a = $(this).attr('id').split('-');
      if ($(this).data('type') == 'pixelsize') {
        a[1] = a[1].slice(0, -2);
        var v = $('#' + a[0] + '-' + a[1] + '_x').val() + 'x' + $('#' + a[0] + '-' + a[1] + '_y').val()
      } else {
        var v = this.value;
      }
      var fn = 'settings.value("' + a[0] + '","' + a[1] + '","' + v + '");'
      csInterface.evalScript(fn);
    });


    // Handle icon buttons
    $(".iconButton").click(function () {
      if ($("#helpSettings").is(":visible")) {
        $('#helpSettings').slideToggle();
      }
      var fn = 'on' + $(this).attr('id') + 'Click()';

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
            html += '<h3>' + Settings[id]['config'][key]['title'] + '</h3>';
            html += '<div class="multicolumn"><div class="column greedy">';
            html += input(id + '-' + key);
            html += '</div><div class="column">';
            html += '<button data-title="' + Settings[id]['config'][key]['title'] +
                    '" data-type="folderBrowse" data-id="' + id + '-' + key +
                    '" class="ccwidget ccbuttonsmall clickable">Browse</button><br/>';
            html += '</div></div>';
          } else if (type == 'pixelsize') {
            html += '<h3>' + Settings[id]['config'][key]['title'] + '</h3>';
            html += input(id + '-' + key + '_x', 'coordinate', type);
            html += ' x ';
            html += input(id + '-' + key + '_y', 'coordinate', type);
          } else if (type == 'color') {
            html += '<h3>' + Settings[id]['config'][key]['title'] + '</h3>';
            html += '<div data-type="color" id="' + id + '-' + key + '" class="ccwidget clickable colorPicker"></div>';
          } else if (type == 'selection') {
            html += '<h3>' + Settings[id]['config'][key]['title'] + '</h3>';
            html += '<select id="' + id + '-' + key + '" class="ccwidget ccselect">';
            for (var i in Settings[id]['config'][key]['values']) {
              var v = Settings[id]['config'][key]['values'][i];
              html += '<option value="' + i + '">' + v + '</option>';
            }
            html += '</select><br/><br/><br/><br/>';
          }
          var fn = 'settings.value("' + id + '","' + key + '");'
          csInterface.evalScript(fn, setValue(id, key, type));
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
