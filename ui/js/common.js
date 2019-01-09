//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Main javascript file in ui side.
//
//**************************************************************************

function config2html(id, items)
{
  var html = '';
  for (var key in items) {
    var type = items[key]['type'];
    if (type == 'text') {
      html += '<h3>' + items[key]['title'] + '</h3>';
      html += '<div class="column">';
      html += input(id + '-' + key, 'fullwidth');
      html += '</div>';
    } else if (type == 'folder') {
      html += '<h3>' + items[key]['title'] + '</h3>';
      html += '<div class="multicolumn"><div class="column greedy">';
      html += input(id + '-' + key);
      html += '</div><div class="column">';
      html += '<button data-title="' + items[key]['title'] +
              '" data-type="folderBrowse" data-id="' + id + '-' + key +
              '" class="ccwidget ccbuttonsmall clickable">Browse</button><br/>';
      html += '</div></div>';
    } else if (type == 'pixelsize') {
      html += '<h3>' + items[key]['title'] + '</h3>';
      html += input(id + '-' + key + '_x', 'coordinate', type);
      html += ' x ';
      html += input(id + '-' + key + '_y', 'coordinate', type);
    } else if (type == 'color') {
      html += '<h3>' + items[key]['title'] + '</h3>';
      html += '<div data-type="color" id="' + id + '-' + key + '" class="ccwidget clickable colorPicker"></div>';
    } else if (type == 'boolean') {
      html += '<input type="checkbox" data-type="boolean" id="' + id + '-' + key + '">  ' +
              items[key]['title'] + '<br>';
    } else if (type == 'selection') {
      html += '<h3>' + items[key]['title'] + '</h3>';
      html += '<select id="' + id + '-' + key + '" class="ccwidget ccselect">';
      for (var i in items[key]['values']) {
        var v = items[key]['values'][i];
        html += '<option value="' + i + '">' + v + '</option>';
      }
      html += '</select><br/><br/><br/><br/>';
    }
  }
  return html;
}
