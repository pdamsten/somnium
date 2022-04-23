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
  open
}

function html2json(id, items)
{
  for (var key in items) {
    var type = items[key]['type'];
    if (type == 'pixelsize') {
      items[key]['value'] = [$('#' + id + '-' + key + '_x').val(),
                             $('#' + id + '-' + key + '_y').val()];
    } else if (type == 'boolean') {
      items[key]['value'] = $('#' + id + '-' + key).prop('checked');
    } else if (type == 'label') {
      // Do nothing
    } else {
      console.log(key, $('#' + id + '-' + key).val());
      items[key]['value'] = $('#' + id + '-' + key).val();
    }
  }
}

function json2html(id, items)
{
  var html = '';
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
  return html;
}

async function open(data)
{
  var jdlg = document.querySelector("#jdialog");
  footer = '<footer><button class="ccbuttondefault">OK</button><button class="ccbutton">Cancel</button></footer>';
  if (jdlg == null) {
    document.querySelector("body").innerHTML = '<dialog id="jdialog"></dialog>' + document.querySelector("body").innerHTML
    jdlg = document.querySelector("#jdialog");
  }

  document.querySelector("#jdialog").innerHTML = '<form>' + json2html('koe', data['items']) + footer + '</form>';

  Array.from(document.querySelectorAll("#jdialog button")).forEach(button => {
    button.onclick = () => document.querySelector("#jdialog").close();
  });

  document.querySelector("#jdialog").uxpShowModal({
    title: data['title'],
    resize: "none",
    size: {
      width: data['width'],
      height: data['height']
    }
  });
}
