//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Logging
//
//**************************************************************************

Log = (function() {

var logFile = '';

return { // public:

sendToConsole: function(txt)
{
  UI.dispatchEvent('console', txt);
},

objectToString: function(obj, prefix)
{
  var s = '';
  prefix = (typeof prefix === 'undefined') ? '' : prefix;
  if (prefix.length > 2) return;

  for (var o in obj) {
    if (obj.hasOwnProperty(o)) {
      try {
        s += prefix + o + ' = ' + obj[o] + '\n';
        if (typeof obj[o] === 'object' && !(obj[o] instanceof Array)) {
          s += this.objectToString(obj[o], prefix + '  ');
        }
      } catch (e) {
        s += prefix + o + ' = ' + e.message + '\n';
      }
    }
  }
  return s;
},

exceptionToString: function(obj)
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
},

isException: function(obj)
{
  return obj.hasOwnProperty('source') && obj.hasOwnProperty('line');
},

isoDate: function()
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
},

init: function(path)
{
  logFile = path;
},

write: function(arguments)
{
  try {
    var s = this.isoDate();
    for (var i = 0; i < arguments.length; ++i) {
      if (typeof arguments[i] == 'object') {
        if (this.isException(arguments[i])) {
          s += ' ' + this.exceptionToString(arguments[i]);
        } else {
          s += ' ' + this.objectToString(arguments[i]);
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
    this.sendToConsole(s);
  } catch (e) {
    alert(e.message);
  }
}

};})();

log = function()
{
  Log.write(arguments);
}
