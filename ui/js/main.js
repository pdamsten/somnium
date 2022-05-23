//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//  Copyright (c) 2018-2022 by Petri Damstén <petri.damsten@gmail.com>
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

const somnium = require('./modules/somnium.js');
const settings = require('./modules/settings.js');
const jdialog = require('./modules/jdialog.js');
const light = require('./modules/tab_light.js');
const plugins = require('./modules/plugins.js');
const tabLight = require('./modules/tab_light.js');
const tabColor = require('./modules/tab_color.js');
const shell = require("uxp").shell;
const fs = require('uxp').storage.localFileSystem;
const batchPlay = require("photoshop").action.batchPlay;
const core = require("photoshop").core;

var colorThemes = [];

(function () {
  'use strict';

  var pluginPath = '';
  var buttonId = null;
  var dialogData = "";
  const HELP = 0, MSG = 1;
  const INFO = 1, WARNING = 2, ERROR = 3;
  var timer = 0;

  async function ColorPicker(executionControl, descriptor) {
    try {
      const openPicker = {
        _target: { _ref: "application" },
        _obj: "showColorPicker",
        context: "Color picker",
        color: {
          _obj: 'RGBColor',
          red: 255,
          green: 0,
          blue: 0,
        },
      };
      const res = await batchPlay([openPicker], {});
      const clr = 'rgb(' + Math.round(res[0].RGBFloatColor.red) + ', ' + Math.round(res[0].RGBFloatColor.grain) + ', ' + Math.round(res[0].RGBFloatColor.blue) + ')';
      $('#' + descriptor).css('background-color', clr);
    } catch(e) {
      console.log(e);
    }
  }

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
    $("#dialog").on('click', '.clickable', async function() {
      let type = $(this).attr('data-type');
      console.log(type);
      if (type == "folderBrowse") {
        const folder = await fs.getFolder();
        if (folder != null) {
          let id = $(this).attr('data-id');
          $('#' + id).val(folder.nativePath);
        }
      } else if (type == "color") {
        core.executeAsModal(ColorPicker, {"commandName": "Color Picker", "descriptor": $(this).attr('id')});
      }
    });
    if ($("#dialog").css("display") == 'none') {
      $('#dialog').show();
    }
  }

  var setButtonName = async function(buttonId, config) {
    if ('config' in config[buttonId] && 'name' in config[buttonId]['config']) {
      $('#' + buttonId + ' .iconButtonTitle').html(config[buttonId]['config']['name']['value']);
    }
  }

  var closeDialog = async function() {
    timer = 0;
    console.log($("#dialog").css("display"));
    if ($("#dialog").css("display") != 'none') {
      $('#dialog').hide();

      if (buttonId) {
        let Settings = await settings.readConfig();
        jdialog.html2json(buttonId, Settings[buttonId]['config']);
        settings.saveDlgValues(Settings[buttonId]);
        setButtonName(buttonId, Settings);
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
      console.log('setValue');
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
    shell.openExternal(url);
  }

  function showTab(name)
  {
    $(".tab").hide();
    $("#" + name + "Tab").show();
    $(".tabbtnselected").removeClass('tabbtnselected');
    $("#" + name).addClass('tabbtnselected');
    var s = $("#" + name).attr('data-title');
    if (s) {
      $("#tabTitle").html(s.toUpperCase());
    }
    localStorage.setItem('currentTab', name);
  }

  async function loadPlugins()
  {
    let result = await plugins.load();
    let html = '';
    let Settings = await settings.readConfig();
    for (let i in result) {
      let id = result[i]['id'];
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

  function initColor()
  {
    colorThemes = Object.keys(Colors);
    for (var i = 0; i < colorThemes.length; ++i) {
      $('#colorTheme').append($('<option>', {value: colorThemes[i], text: colorThemes[i]}));
    }
    $('#colorTheme').append($('<option>', {value: 'Random', text: 'Random'}));
    $("#colorTheme").val('&nbsp;');
    $("#strength").prop('value', 0);
  }

  async function init()
  {
    loadPlugins();
    initColor();
    showTab(localStorage.getItem('currentTab') || 'Retouch');
    var Settings = await settings.readConfig();
    for (var key in Settings) {
      setButtonName(key, Settings);
    }

    $('#header, #content').click(function() {
      closeDialog();
    });

    var delayTimer = null;

    $("#colorTheme").change(function (e) {
      clearTimeout(delayTimer);
      tabColor.themeChanged();
    });
    $("#strength").on("input", function (e) {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(function () {
        tabColor.strengthChanged();
      }, 300);
    });
    $("#strength").on("dblclick", function (e) {
      clearTimeout(delayTimer);
      tabColor.defaultStrength();
    });

    $("#dialog").on("click", "#dlgHeader, #closeDlg", function (e) {
      closeDialog();
    });

    $("#dialog").on("click", "*", function (e) {
      console.log('click *');
      e.stopPropagation();
    });

    // Handle icon buttons
    $("#content").on('click', '.iconButton', function () {
      var cmd = $(this).attr('data-call');
      console.log(cmd);
      if (cmd) {
        eval(cmd + '();');
      } else {
        var fn = 'on' + $(this).attr('id') + 'Click';
        console.log(fn);
        somnium.callJsx(fn);
      }
    });

    // Handle icon button right click
    $("#content").on('contextmenu', '.iconButton', async function() {
      try {
        var id = $(this).attr('id');
        var html = '';
        var Settings = await settings.readConfig();
        if ('config' in Settings[id]) {
          console.log(Settings[id]);
          await settings.loadDlgValues(Settings[id]);
          html = jdialog.json2html(id, Settings[id]['config']);
          openDlg(HELP, Settings[id]['title'], Settings[id]['help'], 'Settings', html);
          buttonId = id;
        }
      } catch(e) {
        console.log(e);
      }
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

  }

  $(document).click(function(event) {
    console.log('click');
  });

  init();

}());
