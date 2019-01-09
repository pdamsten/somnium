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
  var colorThemes = [];
  var buttonId = null;
  var dialogData = "";

  csInterface.addEventListener("com.petridamsten.somnium.console", function(evt) {
    console.log(evt.data);
  });

  csInterface.addEventListener("com.petridamsten.somnium.dialoginit", function(evt) {
    var event = new CSEvent('com.petridamsten.somnium.dialogdata', 'APPLICATION');
    event.data = dialogData;
    csInterface.dispatchEvent(event);
  });

  csInterface.addEventListener("com.petridamsten.somnium.dialogclose", function(evt) {
    //var fn = evt.data['callback'] + "('" + JSON.stringify(evt.data) + "')";
    var fn = "lightsReady()";
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
          html += '<div id="' + id + '" class="iconButton">';
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
    colorThemes = Object.keys(Colors);
    // TODO Sort keys by hue
    $("#color").prop('max', colorThemes.length - 1);
    // TODO Get theme last from previous session
    var theme = colorThemes[$("#color").prop("value")];
    $("#colorTheme").html(theme);
    $("#strength").prop('value', Colors[theme].default);
  }

  function applyColorTheme()
  {
    var values = Colors[colorThemes[$("#color").prop("value")]];
    values.strength = parseInt($("#strength").prop('value'));
    var fn = "onColorThemeChanged('" + JSON.stringify(values) + "')";
    callJsx(fn);
  }

  function colorThemeChanged()
  {
    var theme = colorThemes[$("#color").prop("value")];
    $("#colorTheme").html(theme);
    $("#strength").prop('value', Colors[theme].default);
    applyColorTheme();
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
        colorThemeChanged();
      }, 300);
    });
    $("#color").change(function (e) { // or if users lets go do it immediately
      clearTimeout(delayTimer);
      colorThemeChanged();
    });

    $("#strength").on("input", function (e) {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(function () {
        applyColorTheme();
      }, 300);
    });
    $("#strength").on("dblclick", function (e) {
      clearTimeout(delayTimer);
      var theme = colorThemes[$("#color").prop("value")];
      $("#strength").prop('value', Colors[theme].default);
      applyColorTheme();
    });
    $("#strength").change(function (e) {
      clearTimeout(delayTimer);
      applyColorTheme();
    });

    $("#PrevColor").on("click", function (e) {
      var clr = parseInt($("#color").prop("value"));
      var max = parseInt($("#color").prop("max"));
      var n =  (clr > 0) ? clr - 1 : max;
      $("#color").prop("value", n);
      colorThemeChanged();
      e.stopPropagation();
    });

    $("#RandomColor").on("click", function (e) {
      var clr = parseInt($("#color").prop("value"));
      var max = parseInt($("#color").prop("max"));
      var nclr = Math.floor(Math.random() * (max + 1));
      if (clr == nclr) {
        nclr = (nclr + 1) % (max + 1);
      }
      $("#color").prop("value", nclr);
      colorThemeChanged();
      e.stopPropagation();
    });

    $("#NextColor").on("click", function (e) {
      var clr = parseInt($("#color").prop("value"));
      var max = parseInt($("#color").prop("max"));
      var n =  (clr < max) ? clr + 1 : 0;
      $("#color").prop("value", n);
      colorThemeChanged();
      e.stopPropagation();
    });

    $("#dialog").on("click", "#dlgHeader, #closeDlg", function (e) {
      closeDialog();
    });

    $("#dialog").on("click", "*", function (e) {
      e.stopPropagation();
    });

    // Handle icon buttons
    $("#content").on('click', '.iconButton', function () {
      var fn = 'on' + $(this).attr('id') + 'Click()';
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
  }

  init();

}());
