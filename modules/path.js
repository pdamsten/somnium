//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//  Copyright (c) 2022 by Petri Damstén <petri.damsten@gmail.com>
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

module.exports = {
  removeExt,
  basename,
  dirname,
  ext,
  isMac,
  sep,
}

function isMac()
{
  return true; // TODO ($.os.toLowerCase().indexOf('mac') >= 0);
}

function sep()
{
  return (isMac()) ? '/' : '\\';
}

function basename(filename)
{
  return filename.split(sep()).reverse()[0];
}

function dirname(filename)
{
  return filename.replace(this.basename(filename), '');
}

function ext(filename)
{
  var name = this.basename(filename);

  if (name.indexOf('.') > 0) {
    return '.' + name.split('.').reverse()[0];
  }
  return '';
}

function removeExt(filename)
{
  if (filename.indexOf('.') < 0) {
    return filename;
  }
  return filename.split('.').slice(0, -1).join('.');
}
