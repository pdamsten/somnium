//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Logging
//
//**************************************************************************

var logFile = '~/log.txt';

timeStamp = function()
{
  var date = new Date();
  var yy = date.getYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  yy = (yy < 1000) ? yy + 1900 : yy;
  d = (d < 10) ? '0' + d : d;
  m = (m < 10) ? '0' + m : m;
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  return yy + '-' + m + '-' + d + '_' + hours + ':' + minutes + ':' + seconds;
}

initLog = function(path)
{
  logFile = path;
}

log = function()
{
  try {
    var s = timeStamp();
    for (var i = 0; i < arguments.length; ++i) {
      s += ' ' + arguments[i];
    }
    var f = new File(logFile);
    f.open('a');
    f.encoding = "UTF8"
    f.writeln(s);
    f.close();
  } catch (e) {
    alert(e.message);
  }
}
