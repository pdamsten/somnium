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

const somnium = require('./somnium.js');

module.exports = {
  prevColor,
  nextColor,
  randomColor,
  themeChanged,
  defaultStrength,
  strengthChanged
}

async function prevColor()
{
  try {
    let n = $("#colorTheme").prop('selectedIndex');

    if (n <= 0) {
      n = colorThemes.length - 1;
    } else {
      --n;
    }

    $("#colorTheme").prop('selectedIndex', n);
    $("#strength").prop('value', Colors[colorThemes[n]].default);

    somnium.callJsx("onSetColorTheme", {'theme': colorThemes[n]});
  } catch (e) {
    console.log(e);
  }
}

async function nextColor()
{
  try {
    let n = $("#colorTheme").prop('selectedIndex');

    if (n >= colorThemes.length - 1) {
      n = 0;
    } else {
      ++n;
    }

    $("#colorTheme").prop('selectedIndex', n)
    $("#strength").prop('value', Colors[colorThemes[n]].default);

    somnium.callJsx("onSetColorTheme", {'theme': colorThemes[n]});
  } catch (e) {
    console.log(e);
  }
}

async function randomColor()
{
  try {
    let n = Math.floor(Math.random() * colorThemes.length);

    $("#colorTheme").prop('selectedIndex', n)
    $("#strength").prop('value', Colors[colorThemes[n]].default);

    somnium.callJsx("onSetColorTheme", {'theme': colorThemes[n]});
  } catch (e) {
    console.log(e);
  }
}

async function themeChanged()
{
  try {
    let n = $("#colorTheme").prop('selectedIndex');
    $("#strength").prop('value', Colors[colorThemes[n]].default);

    somnium.callJsx("onSetColorTheme", {'theme': colorThemes[n]});
  } catch (e) {
    console.log(e);
  }
}

async function strengthChanged()
{
  try {
    let v = $('#strength').prop('value');

    somnium.callJsx("onSetColorThemeStrength", {'strength': v});
  } catch (e) {
    console.log(e);
  }
}

async function defaultStrength()
{
  try {
    let n = $("#colorTheme").prop('selectedIndex');
    $("#strength").prop('value', Colors[colorThemes[n]].default);

    somnium.callJsx("onSetColorThemeStrength", {'strength': Colors[colorThemes[n]].default});
  } catch (e) {
    console.log(e);
  }
}
