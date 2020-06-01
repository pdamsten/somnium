//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Common javascript funcs.
//
//**************************************************************************

function input(id, cls, type, val)
{
  cls = (cls == undefined) ? '': ' ' + cls;
  type = (type == undefined) ? '': ' data-type="' + type + '" ';
  val = (val == undefined) ? '': val;
  return '<input id="' + id + '" class="ccwidget ' + cls + '" value="' + val + '"' + type + '>';
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

(function () {
  'use strict';

  var csInterface = new CSInterface();

  // Handle all clickable elements
  $(".jsonWidgets").on("click", ".clickable", function (e) {
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
    console.log(fn);

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
    e.stopPropagation();
  });

  $(".jsonWidgets").on('change', "input, select", function(e) {
    var a = $(this).attr('id').split('-');
    if ($(this).data('type') == 'pixelsize') {
      a[1] = a[1].slice(0, -2);
      var v = '"' + $('#' + a[0] + '-' + a[1] + '_x').val() + 'x' + $('#' + a[0] +
              '-' + a[1] + '_y').val() + '"';
    } else if ($(this).data('type') == 'boolean') {
      var v = $(this).prop('checked');
    } else {
      var v = '"' + this.value + '"';
    }
    var fn = 'settings.value("' + a[0] + '","' + a[1] + '",' + v + ');';
    //console.log(fn);
    csInterface.evalScript(fn);
  });

}());
