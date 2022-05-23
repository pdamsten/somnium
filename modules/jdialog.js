//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//  Copyright (c) 2022 by Petri Damstén <petri.damsten@gmail.com>
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

module.exports = {
  open,
  html2json,
  json2html
}

function onColorPickerClick(color)
{
  try {
    var rgb = color.substring(4, color.length - 1).replace(/ /g, '').split(',');
    var newColor = $.colorPicker(rgb[0] << 16 | rgb[1] << 8 | rgb[2]);
    var r = newColor >> 16;
    var g = newColor >> 8 & 0xFF;
    var b = newColor & 0xFF;
    var s = 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
    return s;
  } catch (e) {
    log(e);
  }
  return 'rgb(0,0,0)'
}

function onBrowseFolderClick(title, path)
{
  try {
    var save = new Folder(File(path).fsName);
    var folder = save.selectDlg(title, '', false);
    return folder;
  } catch (e) {
    console.log(e);
  }
  return addPathSep('~');
}

function input(id, cls, type, val)
{
  cls = (cls == undefined) ? '': ' ' + cls;
  type = (type == undefined) ? '': ' data-type="' + type + '" ';
  val = (val == undefined) ? '': val;
  return '<input id="' + id + '" class="ccwidget ' + cls + '" value="' + val + '"' + type + '>';
}

function html2json(id, items)
{
  try {
    for (var key in items) {
      var type = items[key]['type'];
      if (type == 'pixelsize') {
        items[key]['value'] = [$('#' + id + '-' + key + '_x').val(),
                               $('#' + id + '-' + key + '_y').val()];
      } else if (type == 'boolean') {
        items[key]['value'] = $('#' + id + '-' + key).prop('checked');
      } else if (type == 'label') {
        // Do nothing
      } else if (type == 'selection') {
        items[key]['value'] = parseInt($('#' + id + '-' + key).prop('selectedIndex'));
        items[key]['value-string'] = items[key]['values'][items[key]['value']];
      } else {
        console.log(key, $('#' + id + '-' + key).val());
        items[key]['value'] = $('#' + id + '-' + key).val();
      }
    }
  } catch (e) {
    console.log(e);
  }
  return items;
}

function json2html(id, items)
{
  var html = '<div class="jdialogcontainer">';
  for (var key in items) {
    var type = items[key]['type'];
    if (type == 'text') {
      html += '<div class="label">' + items[key]['title'] + '</div>';
      html += '<div class="column">';
      html += input(id + '-' + key, 'fullwidth', null, items[key]['value']);
      html += '</div>';
    } else if (type == 'folder') {
      html += '<div class="label">' + items[key]['title'] + '</div>';
      html += '<div class="multicolumn"><div class="column greedy">';
      html += input(id + '-' + key, null, null, items[key]['value']);
      html += '</div><div class="column">';
      html += '<button data-title="' + items[key]['title'] +
              '" data-type="folderBrowse" data-id="' + id + '-' + key +
              '" class="ccwidget ccbuttonsmall clickable">Browse</button><br/>';
      html += '</div></div>';
    } else if (type == 'text') {
      html += '<div class="label">' + items[key]['title'] + '</div>';
      html += input(id + '-' + key, null, null, items[key]['value']);
    } else if (type == 'pixelsize') {
      html += '<div class="label">' + items[key]['title'] + '</div>';
      html += input(id + '-' + key + '_x', 'coordinate', type, items[key]['value']);
      html += ' x ';
      html += input(id + '-' + key + '_y', 'coordinate', type, items[key]['value']);
    } else if (type == 'color') {
      html += '<div class="label">' + items[key]['title'] + '</div>';
      html += '<div data-type="color" id="' + id + '-' + key + '" class="ccwidget clickable colorPicker"></div>';
    } else if (type == 'boolean') {
      var chk = (i == items[key]['value']) ? 'checked' : '';
      html += '<input type="checkbox" data-type="boolean" id="' + id + '-' +
              key + '" ' + chk + '>' + items[key]['title'] + '<br>';
    } else if (type == 'selection') {
      html += '<div class="label">' + items[key]['title'] + '</div>';
      html += '<select id="' + id + '-' + key + '" class="ccwidget ccselect">';
      for (var i in items[key]['values']) {
        var v = items[key]['values'][i];
        var sel = (i == items[key]['value']) ? 'selected' : '';
        html += '<option value="' + i + '" ' + sel + '>' + v + '</option>';
      }
      html += '</select>';
    } else if (type == 'label') {
      html += '<div class="label big">' + items[key]['title'] + '</div><br/>';
    }
    html += '</select>';
  }
  html += '</div>'
  return html;
}

async function open(data)
{
  var jdlg = document.querySelector("#jdialog");
  let id = data['title'].replace(' ', '');
  footer = '<footer><button id="jdlgok" class="ccbuttondefault">OK</button><button id="jdlgcancel"  class="ccbutton">Cancel</button></footer>';
  if (jdlg == null) {
    document.querySelector("body").innerHTML = '<dialog id="jdialog"></dialog>' + document.querySelector("body").innerHTML
    jdlg = document.querySelector("#jdialog");
  }

  jdlg.innerHTML = '<form>' + json2html(id, data['items']) + footer + '</form>';

  document.querySelector("#jdlgok").onclick = function() { jdlg.close('ok'); };
  document.querySelector("#jdlgcancel").onclick = function() { jdlg.close('cancel'); };

  /*
  // Handle all clickable elements
  jdlg.onClick(".clickable", function (e) {
    var type = document.querySelector(this).data("type");
    var fn;
    var id;
    var params = [];

    if (type == "folderBrowse") {
      fn = 'BrowseFolder';
      params.push('"' + document.querySelector(this).data("title") + '"');
      id = document.querySelector(this).data("id");
      params.push('"' + document.querySelector('#' + id).val() + '"');
    } else if (type == "color") {
      fn = 'ColorPicker';
      id = document.querySelector(this).attr('id');
      params.push('"' + document.querySelector(this).css('background-color') + '"');
    }

    fn = 'on' + fn + 'Click(' + params.join(',') + ')';
    console.log('TODO ' + fn);
    */
    /*
    csInterface.evalScript(fn, function(result) {
      console.log(result);
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
    */
    /*
    e.stopPropagation();
  });

  jdlg.on('change', "input, select", function(e) {
    var a = document.querySelector(this).attr('id').split('-');
    if (document.querySelector(this).data('type') == 'pixelsize') {
      a[1] = a[1].slice(0, -2);
      var v = '"' + document.querySelector('#' + a[0] + '-' + a[1] + '_x').val() + 'x' +
              document.querySelector('#' + a[0] + '-' + a[1] + '_y').val() + '"';
    } else if (document.querySelector(this).data('type') == 'boolean') {
      var v = document.querySelector(this).prop('checked');
    } else {
      var v = '"' + this.value + '"';
    }
    var fn = 'settings.value("' + a[0] + '","' + a[1] + '",' + v + ');';
    console.log('TODO ' + fn);
    //csInterface.evalScript(fn);
  });
  */
  const res = await jdlg.showModal({
    title: data['title'],
    resize: "none",
    size: {
      width: data['width'],
      height: data['height']
    }
  });
  if (res == 'ok') {
    html2json(id, data['config']);
  }
  // TODO clicks start to vanish after dialog show
  setTimeout(function() {
    console.log('HACK!!! Reloading interface to get clicks working.');
    location.reload();
  }, 1000);
  return res;
}
