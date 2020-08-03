//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//  Copyright (c) 2018-2020 by Petri Damstén <petri.damsten@gmail.com>
//
//  This file is part of Somnium.
//
//  Somnium is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  Foobar is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with Somnium.  If not, see <https://www.gnu.org/licenses/>.
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(function () {
  'use strict';

  var csInterface = new CSInterface();
  var pluginPath = '';
  var colorThemes = [];
  var buttonId = null;
  var dialogData = "";
  var colorPicker = new iro.ColorPicker('#picker', {
    width: 180,
    layoutDirection: "horizontal",
    //borderWidth: 2,
    sliderSize: 20,
    colors: [
      'hsl(0, 100%, 45%)',
      'hsl(120, 100%, 45%)',
      'hsl(240, 100%, 45%)',
    ],
    layout: [
      {
        component: iro.ui.Wheel,
        options: {
          borderColor: '#ffffff',
        }
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'alpha',
          activeIndex: 0,
        }
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'alpha',
          activeIndex: 1,
        }
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'alpha',
          activeIndex: 2,
        }
      }
    ]
  });

  csInterface.addEventListener("com.petridamsten.somnium.setui", function(evt) {
    //console.log('Setting UI', evt.data);
    for (var key in evt.data) {
      if ($('#' + key).is('div') || $('#' + key).is('span')) {
        $('#' + key).html(evt.data[key]);
      } else if ($('#' + key).is('input') || $('#' + key).is('select')) {
        $('#' + key).val(evt.data[key]);
      }
    }
  });

  csInterface.addEventListener("com.petridamsten.somnium.console", function(evt) {
    console.log(evt.data);
  });

  csInterface.addEventListener("com.petridamsten.somnium.dialoginit", function(evt) {
    var event = new CSEvent('com.petridamsten.somnium.dialogdata', 'APPLICATION');
    event.data = dialogData;
    csInterface.dispatchEvent(event);
  });

  csInterface.addEventListener("com.petridamsten.somnium.dialogclose", function(evt) {
    var fn = evt.data['callback'] + "('" + JSON.stringify(evt.data) + "')";
    callJsx(fn);
  });

  csInterface.addEventListener("com.petridamsten.somnium.opendialog", function(evt) {
    var extension_Id = "com.petridamsten.somnium.dialog";
    var params = {}; // Params don't work, use events...
    dialogData = JSON.stringify(evt.data);
    window.__adobe_cep__.requestOpenExtension(extension_Id, params);
  });

  function initJsx()
  {
    pluginPath = csInterface.getSystemPath(SystemPath.EXTENSION) + '/';
    csInterface.evalScript('init("' + pluginPath + '")', function(result) {
      if (result != 'EvalScript error.') {
        result = JSON.parse(result);
        var html = '';
        for (var i in result) {
          var id = result[i]['id'];
          Settings[id] = result[i];
          html += '<div id="' + id + '" class="iconButton" data-call="' +
                  Settings[id]['call'] + '">';
          html += '<img src="' + Settings[id]['icon'] + '">';
          html += Settings[id]['title'];
          html += '</div>';
        }
        if (html != '') {
          $('#PluginsTab .tabcontent').html(html);
          $("#Plugins").css("display", "block");
        }
      }
    });
  }

  const HELP = 0, MSG = 1;
  const INFO = 1, WARNING = 2, ERROR = 3;
  var timer = 0;

  var openDlg = function(type, title, text, arg1, arg2)
  {
    clearTimeout(timer);
    buttonId = null;
    $('#settings').hide();
    $('#helpText').hide();
    $('#msgText').hide();
    if (type == HELP) {
      $('#dlgHeader').html(title);
      $('#helpText').html(text);
      if (arg2) {
        $('#settingsHeader').html(arg1);
        $('.jsonWidgets').html(arg2);
        $('#settings').show();
      }
      $('#helpText').show();
    } else if (type == MSG) {
      if (text) {
        $('#dlgHeader').html(title);
        $('#msgText').html(text);
      } else {
        var msg = JSON.parse(title);
        $('#dlgHeader').html(msg['title']);
        $('#msgText').html(msg['msg']);
        if (msg['type'] < WARNING) { // Just a message
          timer = setTimeout(closeDialog, 3000);
        }
      }
      $('#msgText').show();
    }
    if (!$("#dialog").is(":visible")) {
      $('#dialog').slideToggle();
    }
  }

  var setButtonName = function(buttonId) {
    if ('config' in Settings[buttonId] && 'name' in Settings[buttonId]['config']) {
      var fn = 'settings.value("' + buttonId + '","name");';
      csInterface.evalScript(fn, function(result, buttonId) {
        if (result != '') {
          $('#' + this.buttonId + ' .iconButtonTitle').html(result);
        }
      }.bind({buttonId: buttonId}));
    }
  }

  var closeDialog = function() {
    timer = 0;
    if ($("#dialog").is(":visible")) {
      $('#dialog').slideToggle();

      if (buttonId) {
        setButtonName(buttonId);
      }
    }
  }

  var setValue = function(id, key, type)
  {
    var data = {
      'id': id,
      'key': key,
      'type': type
    };

    return function(result) {
      var id = '#' + data['id'] + '-' + data['key'];
      //console.log(id, result, typeof result);
      if (data['type'] == 'text') {
        $(id).val(result);
      } else if (data['type'] == 'folder') {
        $(id).val(result);
      } else if (data['type'] == 'color') {
        $(id).css('background-color', result);
      } else if (data['type'] == 'pixelsize') {
        var a = result.split('x');
        $(id + '_x').val(a[0]);
        $(id + '_y').val(a[1]);
      } else if (data['type'] == 'boolean') {
        $(id).prop('checked', (result == "true"));
      } else if (data['type'] == 'selection') {
        $(id).val(result);
      }
    }
  }

  function openURL(url)
  {
    var fn = "openURL('" + url + "')";
    callJsx(fn);
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

  function initColor()
  {
    colorThemes = Object.keys(Colors).sort();
    for (var i = 0; i < colorThemes.length; ++i) {
      $('#colorTheme').append($('<option>', {value: colorThemes[i], text: colorThemes[i]}));
    }
    $('#colorTheme').append($('<option>', {value: 'Random', text: 'Random'}));
    $("#colorTheme").val('&nbsp;');
    $("#color").prop('max', colorThemes.length - 1);
    $("#strength").prop('value', 0);
  }

  function changeStrength()
  {
    var fn = "setColorThemeStrength(" + $('#strength').prop('value') + ")";
    callJsx(fn);
  }

  function changeTheme()
  {
    var theme = colorThemes[$("#color").prop("value")];
    var fn = "setColorTheme('" + theme + "')";
    callJsx(fn);
  }

  function callJsx(fn) {
    closeDialog();
    csInterface.evalScript(fn, function(result) {
      if (result === "EvalScript error.") {
        console.log('Error running: ' + fn + ', ' + result);
      }
      else if (result != 'undefined') { // Yes string after eval
        openDlg(MSG, result);
      }
    });
  }

  function init()
  {
    initJsx();
    initColor();
    csInterface.evalScript('isDebug()', function(result) {
      if (result == 'true') { // Yes string after eval
        $(".experimental").css("display", "inline-block");
      }
    });
    themeManager.init();
    showTab(localStorage.getItem('currentTab') || 'Retouch');
    for (var key in Settings) {
      setButtonName(key);
    }

    $('#header, #content').click(function() {
      closeDialog();
    });

    var delayTimer = null;
    $("#color").on("input", function (e) { // input event on timer. otherwise too many events.
      clearTimeout(delayTimer);
      delayTimer = setTimeout(function () {
        changeTheme();
      }, 300);
    });
    $("#color").change(function (e) { // or if users lets go do it immediately
      clearTimeout(delayTimer);
      changeTheme();
    });

    $("#colorTheme").change(function (e) {
      clearTimeout(delayTimer);
      var fn = "setColorTheme('" + $("#colorTheme").val() + "')";
      callJsx(fn);
    });

    $("#strength").on("input", function (e) {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(function () {
        changeStrength();
      }, 300);
    });
    $("#strength").on("dblclick", function (e) {
      clearTimeout(delayTimer);
      var theme = colorThemes[$("#color").prop("value")];
      $("#strength").prop('value', Colors[theme].default);
      changeStrength();
    });
    $("#strength").change(function (e) {
      clearTimeout(delayTimer);
      changeStrength();
    });

    $("#dialog").on("click", "#dlgHeader, #closeDlg", function (e) {
      closeDialog();
    });

    $("#dialog").on("click", "*", function (e) {
      e.stopPropagation();
    });

    // Handle icon buttons
    $("#content").on('click', '.iconButton', function () {
      /* enable if there is a need for this data
      var values = {};
      $("input").each(function() {
        values[$(this).attr("id")] = $(this).val();
      });
      var fn = 'on' + $(this).attr('id') + 'Click(\'' + JSON.stringify(values) + '\')';
      */
      var fn = $(this).attr('data-call');
      if (!fn) {
        fn = 'on' + $(this).attr('id') + 'Click';
      }
      fn += '()';
      callJsx(fn);
    });

    // Handle icon button right click
    $("#content").on('contextmenu', '.iconButton', function () {
      var id = $(this).attr('id');
      var html = '';
      if ('config' in Settings[id]) {
        $('#settings').show();
        html = json2html(id, Settings[id]['config']) + '<br/><br/><br/><br/>';
        for (var key in Settings[id]['config']) {
          var type = Settings[id]['config'][key]['type'];
          var fn = 'settings.value("' + id + '","' + key + '");'
          csInterface.evalScript(fn, setValue(id, key, type));
        }
      }
      openDlg(HELP, Settings[id]['title'], Settings[id]['help'], 'Settings', html);
      buttonId = id;
      return false;
    });

    $(".tabbtn").click(function () {
      showTab($(this).attr('id'));
    });

    $(".link").click(function () {
      openURL($(this).attr('data-link'));
    });

    $("body").on('contextmenu', ':not(.iconButton)', function () {
      //console.log($(this).attr('id'), $(this).hasClass('iconButton'));
      return false;
    });

    colorPicker.on('color:change', function(color) {
      var n = colorPicker.colors.length;
      for (var i = 1; i < n; ++i) {
        colorPicker.colors[(color.index + i) % n].setChannel('hsl', 'h',
                           (color.hsl.h + (i * 120)) % 360);
      }
    });

  }

  init();

}());
