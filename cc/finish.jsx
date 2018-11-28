//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Finish tab code
//
//**************************************************************************

onHighPassSharpeningClick = function(type)
{
  try {
    var group = checkGroup('Finish');
    var l = stampCurrentAndBelow(group, 'High Pass Sharpening');
    doHighPass(l, 3.0, true);
    setLayerBlendingMode(l, 'hard light');
  } catch (e) {
    log(e);
  }
}
