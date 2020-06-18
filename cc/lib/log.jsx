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
    s += argumentsToString(arguments);
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
