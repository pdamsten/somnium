//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Logging
//
//**************************************************************************

var logFile = '~/log.txt';

objectToString = function(obj)
{
  var s = '';
  for (var o in obj) {
    if (obj.hasOwnProperty(o)) {
      s += o + ' = ' + obj[o] + '\n';
    }
  }
  return s;
}

exceptionToString = function(obj)
{
  var a = obj.source.split('\n');
  var fn = '';
  var line = a[obj.line - 1].replace(/^\s+|\s+$/g, '');
  for (var i = obj.line; i >= 0; --i) {
    if (a[i].indexOf('function') >= 0) {
      fn = a[i];
      fn = fn.replace('function', '');
      fn = fn.replace(/[{}=]/g, '');
      fn = fn.replace(/\(.*\)/, '');
      fn = fn.replace(/^\s+|\s+$/g, ''); // Trim
      break;
    }
  }
  return '(' + fn + ':' + (obj.line) + ') ' + line + ' : ' + obj.message;
}

isException = function(obj)
{
  return obj.hasOwnProperty('source') && obj.hasOwnProperty('line');
}

isoDate = function()
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
  return yy + '-' + m + '-' + d + 'T' + hours + ':' + minutes + ':' + seconds;
}

initLog = function(path)
{
  logFile = path;
}

log = function()
{
  try {
    var s = isoDate();
    for (var i = 0; i < arguments.length; ++i) {
      if (typeof arguments[i] == 'object') {
        if (isException(arguments[i])) {
          s += ' ' + exceptionToString(arguments[i]);
        } else {
          s += ' ' + objectToString(arguments[i]);
        }
      } else {
        s += ' ' + arguments[i];
      }
    }
    var f = new File(logFile);
    f.open('a');
    f.encoding = "BINARY"; // For proper line ending
    f.write(s + '\n');
    f.close();
  } catch (e) {
    alert(e.message);
  }
}
