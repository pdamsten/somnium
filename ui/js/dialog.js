//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Main javascript file in ui side.
//
//**************************************************************************

(function () {
  'use strict';

  var cs = new CSInterface();

  cs.addEventListener('koe', function(event) {
    alert(event);
  });

  function init()
  {
    themeManager.init();
  }

  init();

  console.log('A');

}());
