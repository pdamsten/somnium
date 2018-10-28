//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish - Color tab code
//
//**************************************************************************

onPrevColorClick = function()
{
  try {
    var lookup = "/Applications/Adobe Photoshop CC 2019/Presets/3DLUTs/Bleach Bypass.look";
    var group = checkGroup('Color', 'Finish', 'Help Layers');
    var layer = createColorLookup('test');
    setColorLookup(layer, lookup);
  } catch (e) {
    log(e);
  }
}
