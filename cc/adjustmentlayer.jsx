//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Adjustment layer handling
//
//**************************************************************************

const PhotoshopPath = dirname(Folder.appPackage.fsName);

createColorLookup = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc0 = new ActionDescriptor();
    var ref0 = new ActionReference();
    ref0.putClass(cTID('AdjL'));
    desc0.putReference(cTID('null'), ref0);
    var desc1 = new ActionDescriptor();
    desc1.putClass(cTID('Type'), sTID("colorLookup"));
    desc0.putObject(cTID('Usng'), cTID('AdjL'), desc1);
    executeAction(cTID('Mk  '), desc0, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setColorLookup = function(layer, lookup)
{
  try {
    activateLayer(layer);

    var ref1 = new ActionReference();
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();

    lookup = lookup.replace('%PHOTOSHOP%', PhotoshopPath);
    lookup = lookup.replace('%PLUGIN%', pluginPath);
    var profile = pluginPath + 'assets' + sep() + removeExt(basename(lookup)) + '.ps-lut-data';
    //log(profile);
    var f = new File(profile);
    f.open('r');
    f.encoding = "BINARY";
    var pdata = f.read();
    f.close();
    desc2.putEnumerated(sTID("lookupType"), sTID("colorLookupType"), sTID("3DLUT"));
    desc2.putString(cTID("Nm  "), lookup);
    desc2.putData(sTID("profile"), pdata);

    var e = ext(lookup).toLowerCase();
    var type = '';
    if (e == '.cube') {
      type = 'LUTFormatCUBE';
    } else if  (e == '.look') {
      type = 'LUTFormatLOOK';
    } else if (e == '.3dl') {
      type = 'LUTFormat3DL';
    }
    desc2.putEnumerated(sTID("LUTFormat"), sTID("LUTFormatType"), sTID(type));

    var f = new File(lookup);
    f.open('r');
    f.encoding = "BINARY";
    var ldata = f.read();
    f.close();

    desc2.putData(sTID("LUT3DFileData"), ldata);
    desc2.putString(sTID("LUT3DFileName"), lookup);

    ref1.putEnumerated(cTID("AdjL"), cTID("Ordn"), cTID("Trgt"));
    desc1.putReference(cTID("null"), ref1);
    desc1.putObject(cTID("T   "), sTID("colorLookup"), desc2);
    executeAction(cTID("setd"), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return null;
  }
}

var CurveChannels = {'master': 'Cmps', 'red': 'Rd  ', 'green': 'Grn ', 'blue': 'Bl  '};

createCurveAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc2.putObject(cTID('Type'), cTID('Crvs'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setCurveAdjustment = function(layer, data)
{
  try {
    if (data instanceof Array) {
      data = {'master': data};
    }
    activateLayer(layer);
    for (var type in CurveChannels) {
      if (type in data) {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
        desc1.putReference(cTID('null'), ref1);
        var desc2 = new ActionDescriptor();
        desc2.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
        var list1 = new ActionList();
        var desc3 = new ActionDescriptor();
        var ref2 = new ActionReference();
        ref2.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID(CurveChannels[type]));
        desc3.putReference(cTID('Chnl'), ref2);
        var list2 = new ActionList();
        for (var i = 0; i < data[type].length; ++i) {
          var desc4 = new ActionDescriptor();
          desc4.putDouble(cTID('Hrzn'), data[type][i][0]);
          desc4.putDouble(cTID('Vrtc'), data[type][i][1]);
          list2.putObject(cTID('Pnt '), desc4);
        }
        desc3.putList(cTID('Crv '), list2);
        list1.putObject(cTID('CrvA'), desc3);
        desc2.putList(cTID('Adjs'), list1);
        desc1.putObject(cTID('T   '), cTID('Crvs'), desc2);
        executeAction(cTID('setd'), desc1, DialogModes.NO);
      }
    }
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

curvePoint = function(pos, percentage)
{
  var p = (typeof percentage !== 'undefined') ?  percentage : 0;
  var v = pos + (p / 100.0 * 255);
  v = Math.max(v, 0);
  v = Math.min(v, 255);
  return [pos, v];
}

scurve = function(percentage, dark, light)
{
  return [curvePoint(0, dark), curvePoint(64, -1 * percentage),
          curvePoint(192, percentage), curvePoint(255, light)];
}

createChannelMixer = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    var desc4 = new ActionDescriptor();
    desc4.putUnitDouble(cTID('Rd  '), cTID('#Prc'), 100);
    desc3.putObject(cTID('Rd  '), cTID('ChMx'), desc4);
    var desc5 = new ActionDescriptor();
    desc5.putUnitDouble(cTID('Grn '), cTID('#Prc'), 100);
    desc3.putObject(cTID('Grn '), cTID('ChMx'), desc5);
    var desc6 = new ActionDescriptor();
    desc6.putUnitDouble(cTID('Bl  '), cTID('#Prc'), 100);
    desc3.putObject(cTID('Bl  '), cTID('ChMx'), desc6);
    desc2.putObject(cTID('Type'), cTID('ChnM'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setChannelMixer = function(layer, color, cnst, mono)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
    desc2.putBoolean(cTID('Mnch'), mono);
    var desc3 = new ActionDescriptor();
    desc3.putUnitDouble(cTID('Rd  '), cTID('#Prc'), color[0]);
    desc3.putUnitDouble(cTID('Grn '), cTID('#Prc'), color[1]);
    desc3.putUnitDouble(cTID('Bl  '), cTID('#Prc'), color[2]);
    desc3.putUnitDouble(cTID('Cnst'), cTID('#Prc'), cnst);
    desc2.putObject(cTID('Gry '), cTID('ChMx'), desc3);
    desc1.putObject(cTID('T   '), cTID('ChnM'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
     return false;
  }
}

createSolidColorAdjustment = function(name, layer, color)
{
  try {
    color = (color == undefined) ? [0, 0, 0]: color;
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("contentLayer"));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    var desc4 = new ActionDescriptor();
    desc4.putDouble(cTID('Rd  '), color[0]);
    desc4.putDouble(cTID('Grn '), color[1]);
    desc4.putDouble(cTID('Bl  '), color[2]);
    desc3.putObject(cTID('Clr '), sTID("RGBColor"), desc4);
    desc2.putObject(cTID('Type'), sTID("solidColorLayer"), desc3);
    desc1.putObject(cTID('Usng'), sTID("contentLayer"), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
};

setSolidColorAdjustment = function(layer, color)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(sTID("contentLayer"), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putDouble(cTID('Rd  '), color[0]);
    desc3.putDouble(cTID('Grn '), color[1]);
    desc3.putDouble(cTID('Bl  '), color[2]);
    desc2.putObject(cTID('Clr '), sTID("RGBColor"), desc3);
    desc1.putObject(cTID('T   '), sTID("solidColorLayer"), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
};

createHueSaturationAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc3.putBoolean(cTID('Clrz'), false);
    desc2.putObject(cTID('Type'), cTID('HStr'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setHueSaturationAdjustment = function(layer, hue, saturation, lightness)
{
  try {
    var values = null;
    if (typeof hue === 'object') {
      values = hue;
    } else {
      values = {"master": [hue, saturation, lightness]}
    }
    if (!("colorize" in values)) {
      values["colorize"] = false;
    }

    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putBoolean(cTID('Clrz'),values["colorize"]);

    var list1 = new ActionList();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Cmps'));
    desc3.putInteger(cTID('H   '), values['master'][0]);
    desc3.putInteger(cTID('Strt'), values['master'][1]);
    desc3.putInteger(cTID('Lght'), values['master'][2]);
    list1.putObject(cTID('Hst2'), desc3);

    if (!values["colorize"] && "ranges" in values) {
      for (i in values["ranges"]) {
        var desc4 = new ActionDescriptor();
        desc4.putInteger(cTID('LclR'), i + 1);
        desc4.putInteger(cTID('BgnR'), values["ranges"][i][3]);
        desc4.putInteger(cTID('BgnS'), values["ranges"][i][4]);
        desc4.putInteger(cTID('EndS'), values["ranges"][i][5]);
        desc4.putInteger(cTID('EndR'), values["ranges"][i][6]);
        desc4.putInteger(cTID('H   '), values["ranges"][i][0]);
        desc4.putInteger(cTID('Strt'), values["ranges"][i][1]);
        desc4.putInteger(cTID('Lght'), values["ranges"][i][2]);
        list1.putObject(cTID('Hst2'), desc4);
      }
    }
    desc2.putList(cTID('Adjs'), list1);
    desc1.putObject(cTID('T   '), cTID('HStr'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

createSelectiveColorAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc2.putObject(cTID('Type'), cTID('SlcC'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

const SelectiveColors = {'reds': 'Rds ', 'yellows': 'Ylws', 'greens': 'Grns',
                         'cyans': 'Cyns', 'blues': 'Bls ', 'magentas': 'Mgnt',
                         'whites': 'Whts', 'neutrals': 'Ntrl', 'blacks': 'Blks'};

setSelectiveColorAdjustment = function(layer, values, absolute)
{
  try {
    activateLayer(layer);
    for (v in values) {
      var desc1 = new ActionDescriptor();
      var ref1 = new ActionReference();
      ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
      desc1.putReference(cTID('null'), ref1);
      var desc2 = new ActionDescriptor();
      var list1 = new ActionList();
      var desc3 = new ActionDescriptor();
      desc3.putEnumerated(cTID('Clrs'), cTID('Clrs'), cTID(SelectiveColors[v]));
      desc3.putUnitDouble(cTID('Cyn '), cTID('#Prc'), values[v][0]);
      desc3.putUnitDouble(cTID('Mgnt'), cTID('#Prc'), values[v][1]);
      desc3.putUnitDouble(cTID('Ylw '), cTID('#Prc'), values[v][2]);
      desc3.putUnitDouble(cTID('Blck'), cTID('#Prc'), values[v][3]);
      list1.putObject(cTID('ClrC'), desc3);
      desc2.putList(cTID('ClrC'), list1);
      desc1.putObject(cTID('T   '), cTID('SlcC'), desc2);
      executeAction(cTID('setd'), desc1, DialogModes.NO);
    }
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    if (absolute) {
      desc2.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
      desc2.putEnumerated(cTID('Mthd'), cTID('CrcM'), cTID('Absl'));
    } else {
      desc2.putEnumerated(cTID('Mthd'), cTID('CrcM'), cTID('Rltv'));
    }
    desc1.putObject(cTID('T   '), cTID('SlcC'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

createGradientMapAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    var desc4 = new ActionDescriptor();
    desc4.putString(cTID('Nm  '), name);
    desc4.putEnumerated(cTID('GrdF'), cTID('GrdF'), cTID('CstS'));
    desc4.putDouble(cTID('Intr'), 4096);
    desc3.putObject(cTID('Grad'), cTID('Grdn'), desc4);
    desc2.putObject(cTID('Type'), cTID('GdMp'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setGradientMapAdjustment = function(layer, values)
{
  try {
    activateLayer(layer);

    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putString(cTID('Nm  '), name);
    desc3.putEnumerated(cTID('GrdF'), cTID('GrdF'), cTID('CstS'));
    desc3.putDouble(cTID('Intr'), 4096);
    if ('colors' in values) {
      var list1 = new ActionList();
      var desc4 = new ActionDescriptor();
      var desc5 = new ActionDescriptor();
      for (var i in values['colors']) {
        desc5.putDouble(cTID('Rd  '), values['colors'][i][0]);
        desc5.putDouble(cTID('Grn '), values['colors'][i][1]);
        desc5.putDouble(cTID('Bl  '), values['colors'][i][2]);
        desc4.putObject(cTID('Clr '), sTID("RGBColor"), desc5);
        desc4.putEnumerated(cTID('Type'), cTID('Clry'), cTID('UsrS'));
        desc4.putInteger(cTID('Lctn'), 4096 * values['colors'][i][3] / 100);
        desc4.putInteger(cTID('Mdpn'), values['colors'][i][4]);
        list1.putObject(cTID('Clrt'), desc4);
      }
      desc3.putList(cTID('Clrs'), list1);
    }
    if ('opacity' in values) {
      var list2 = new ActionList();
      var desc14 = new ActionDescriptor();
      for (var i in values['opacity']) {
        desc14.putUnitDouble(cTID('Opct'), cTID('#Prc'), values['opacity'][i][0]);
        desc14.putInteger(cTID('Lctn'), values['opacity'][i][1]);
        desc14.putInteger(cTID('Mdpn'), values['opacity'][i][2]);
        list2.putObject(cTID('TrnS'), desc14);
      }
      desc3.putList(cTID('Trns'), list2);
    }
    desc2.putObject(cTID('Grad'), cTID('Grdn'), desc3);
    desc1.putObject(cTID('T   '), cTID('GdMp'), desc2);

    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}
