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

function input(id, cls, type, val)
{
  cls = (cls == undefined) ? '': ' ' + cls;
  type = (type == undefined) ? '': ' data-type="' + type + '" ';
  val = (val == undefined) ? '': val;
  return '<input id="' + id + '" class="ccwidget ' + cls + '" value="' + val + '"' + type + '>';
}

(function () {
  'use strict';

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
    //csInterface.evalScript(fn);
  });

}());
