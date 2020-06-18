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

Log = (function() {

var logFile = '';

return { // public:

sendToConsole: function(txt)
{
  if (typeof SUI !== 'undefined') {
    SUI.dispatchEvent('console', txt);
  } else {
    salert(txt);
  }
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
    s += arguments2string(arguments);
    var f = new File(logFile);
    f.open('a');
    f.encoding = "BINARY"; // For proper line ending
    f.write(s + '\n');
    f.close();
    this.sendToConsole(s);
  } catch (e) {
    salert("Log write: ", e);
  }
}

};})();

log = function()
{
  Log.write(arguments);
}
