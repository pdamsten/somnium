//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Main javascript file in ui side.
//
//**************************************************************************

(function () {
  'use strict';

  themeManager.init();

  var cs = new CSInterface();
  cs.setWindowTitle("Somnium Dialog");

  cs.addEventListener('com.petridamsten.somnium.dialogdata', function(event) {
    console.log("type=" + event.type + ", data=" + event.data);
  });

  $(".ccbutton").on("click", function (e) {
    cs.closeExtension();
  });

  var event = new CSEvent('com.petridamsten.somnium.dialoginit', 'APPLICATION');
  cs.dispatchEvent(event);

}());
