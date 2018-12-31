//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Adjustment handling
//
//**************************************************************************

metadata = function(filename)
{
  var data = {};
  try {
    if ( ExternalObject.AdobeXMPScript == undefined ) {
      ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    }
    var xmpfile = new XMPFile(filename, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmp = xmpfile.getXMP();
    log(xmp.serialize());
    data['title'] = xmp.getProperty(XMPConst.NS_DC, "title[1]").toString();
    data['model'] = xmp.getProperty(XMPConst.NS_TIFF, "Model").toString();
    data['lens'] = xmp.getProperty(XMPConst.NS_EXIF_AUX, "Lens").toString();
    data['aperture'] = eval(xmp.getProperty(XMPConst.NS_EXIF, "FNumber").toString());
    data['exposure'] = xmp.getProperty(XMPConst.NS_EXIF, "ExposureTime").toString();
    data['focallength'] = xmp.getProperty(XMPConst.NS_EXIF, "FocalLengthIn35mmFilm").toString();
    data['iso'] = xmp.getProperty(XMPConst.NS_EXIF, "ISOSpeedRatings[1]").toString();
  } catch (e) {
    log(e);
  }
  return data;
}
