//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//**************************************************************************

#include "ps-lut-data.jsx"

var f = new File((new File($.fileName)).parent + '/untitled.ps-lut-data');
f.open('w');
f.encoding = "BINARY";
f.write(data);
f.close();

alert(data.length);
