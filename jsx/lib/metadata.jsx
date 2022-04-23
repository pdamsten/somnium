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

Metadata = (function() {

calc = function(s, floatresult)
{
  floatresult = (floatresult === undefined) ? false : floatresult;

  var a = s.split('/');

  if (a.length == 1) {
    return s;
  }
  if (a[1] == '1') {
    return a[0];
  }
  if (floatresult) {
    return (a[0] / a[1]).toString();
  } else {
    return s;
  }
}

return { // public:

get: function(filename)
{
  var data = {};
  try {
    if ( ExternalObject.AdobeXMPScript == undefined ) {
      ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    }
    var xmpfile = new XMPFile(filename, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmp = xmpfile.getXMP();
    //log(xmp.serialize());
    data['title'] = xmp.getProperty(XMPConst.NS_DC, "title[1]").toString();
    data['model'] = xmp.getProperty(XMPConst.NS_TIFF, "Model").toString();
    data['lens'] = xmp.getProperty(XMPConst.NS_EXIF_AUX, "Lens").toString();
    data['aperture'] = calc(xmp.getProperty(XMPConst.NS_EXIF, "FNumber").toString(), true);
    data['exposure'] = calc(xmp.getProperty(XMPConst.NS_EXIF, "ExposureTime").toString());
    data['focallength'] = xmp.getProperty(XMPConst.NS_EXIF, "FocalLengthIn35mmFilm").toString();
    data['iso'] = xmp.getProperty(XMPConst.NS_EXIF, "ISOSpeedRatings[1]").toString();
    data['creationdate'] = xmp.getProperty(XMPConst.NS_XMP, "CreateDate").toString();
  } catch (e) {
    log(e);
  }
  return data;
}

};})();
