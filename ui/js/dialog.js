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

  var data = null;

  themeManager.init();

  var cs = new CSInterface();
  cs.setWindowTitle("Somnium Dialog");

  cs.addEventListener('com.petridamsten.somnium.dialogdata', function(event) {
    data = event.data;
    cs.setWindowTitle(data['title']);
    $(".jsonWidgets").html(json2html("modalDlg", data['items']));
    cs.resizeContent(400, $("body").height() + 30);
  });

  $(".ccbutton").on("click", function (e) {
    cs.closeExtension();
  });

  $(".ccbuttondefault").on("click", function (e) {
    html2json("modalDlg", data['items']);
    var event = new CSEvent('com.petridamsten.somnium.dialogclose', 'APPLICATION');
    event.data = data;
    cs.dispatchEvent(event);
    cs.closeExtension();
  });

  var event = new CSEvent('com.petridamsten.somnium.dialoginit', 'APPLICATION');
  cs.dispatchEvent(event);

}());
