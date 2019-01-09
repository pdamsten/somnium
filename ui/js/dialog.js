//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Main javascript file in ui side.
//
//**************************************************************************

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
