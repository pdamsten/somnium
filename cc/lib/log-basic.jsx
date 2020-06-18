//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//  Copyright (c) 2020 by Petri Damstén <petri.damsten@gmail.com>
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

isDebug = function()
{
  var d = new File(pluginPath + 'debug.sh');
  if (d.exists) { // We are in developing environment
    return true;
  }
  return false;
}

objectToString = function(obj, prefix)
{
  var s = '';
  prefix = (typeof prefix === 'undefined') ? '' : prefix;
  if (prefix.length > 2) return;

  for (var o in obj) {
    if (obj.hasOwnProperty(o)) {
      try {
        s += prefix + o + ' = ' + obj[o] + '\n';
        if (typeof obj[o] === 'object' && !(obj[o] instanceof Array)) {
          s += objectToString(obj[o], prefix + '  ');
        }
      } catch (e) {
        s += prefix + o + ' = ' + e.message + '\n';
      }
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

argumentsToString = function(arguments)
{
  var s = '';
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
  return s;
}

salert = function()
{
  if (isDebug()) {
    alert(argumentsToString(arguments));
  }
}
log = salert; // default implementation until we have full log
