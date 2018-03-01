//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Layer & Group handling
//
//**************************************************************************

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

enableSmartFilters = function(layer, enable)
{
  try {
    activateLayer(layer);
    if (enable) {
      cmd = cTID('Shw ');
    } else {
      cmd = cTID('Hd  ');
    }
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("filterFX"));
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cmd, desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false; // No smart filter
  }
}

deleteSmartFilters = function(layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("filterFX"));
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Dlt '), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

newSmartObjectViaCopy = function(layer)
{
  try {
    activateLayer(layer);
    executeAction(sTID('placedLayerMakeCopy'), undefined, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

editSmartObjectContents = function(layer)
{
  try {
    activateLayer(layer);
    executeAction(sTID('placedLayerEditContents'), undefined, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

setLayerBlendingMode = function(layer, mode)
{
  var modes = {'color': 'Clr ', 'luminosity': 'Lmns'};
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID(modes[mode]));
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

hideAllLayers = function()
{
  var len = layers.length;

  for (var i = 0; i < len; ++i) {
    if (!(layers[i].layer.typename == 'LayerSet')) {
      layers[i].layer.visible = false;
    }
  }
}

var _layersList = [];
var _lindex = 0;

layersList = function(player, _pindex)
{
  try {
    if (typeof pindex === 'undefined') {
      _pindex = -1;
      _layersList = [];
      _lindex = 0;
    }
    player = (typeof player !== 'undefined') ? app.activeDocument : player;
    var len = player.layers.length;

    for (var i = len - 1; i >= 0; --i) {
      var layer = player.layers[i];
      _layersList[_lindex++] = {'parent': _pindex, 'layer': layer, 'visible': layer.visible};
      if (layer.typename == 'LayerSet') {
        layersList(layer, _lindex - 1);
      }
    }
    return _layersList;
  } catch (e) {
    log(e);
    return null;
  }
}

activateLayer = function(layer)
{
  if (typeof layer !== 'undefined') {
    if (typeof layer === 'string' && layer == 'first') {
      app.activeDocument.activeLayer = app.activeDocument.layers[0];
    } else if (typeof layer === 'string' && layer == 'last') {
      app.activeDocument.activeLayer = app.activeDocument.layers[app.activeDocument.layers.length - 1];
    } else {
      app.activeDocument.activeLayer = layer;
    }
  }
  return app.activeDocument.activeLayer;
}

findLayer = function(name, parent, type)
{
  try {
    layers = layersList();

    for (var i = 0; i < layers.length; ++i) {
      if (layers[i].layer.name == name) {
        if (typeof parent !== 'undefined' && layers[i].parent != -1 &&
            layers[layers[i].parent].layer.name != parent) {
          continue;
        }
        if (typeof type !== 'undefined' && layers[i].layer.typename != type) {
          continue;
        }
        return layers[i].layer;
      }
    }
  } catch (e) {
    log(e);
  }
  return null;
}

checkLayer = function(name, parent)
{
  var layer = findLayer(name, parent);
  if (layer != null) {
    var v = layer.visible;
    app.activeDocument.activeLayer = layer;
    app.activeDocument.activeLayer.visible = v;
    return layer;
  }
  return null;
}

findGroup = function(name, parent)
{
  return findLayer(name, parent, 'LayerSet');
}

createGroup = function(name, layer)
{
  var layer = activateLayer(layer);
  var group = app.activeDocument.layerSets.add();
  group.name = name;
  app.activeDocument.activeLayer = group;
  if (layer.typename == 'LayerSet') {
    var before = layer.layerSets.add();
    group.move(before, ElementPlacement.PLACEBEFORE); // Does not support ElementPlacement.INSIDE
    before.remove();
  }
  return group;
}

checkGroup = function(name)
{
  var group = findGroup(name);
  if (group == null) {
    group = createGroup(name, 'first');
  }
  app.activeDocument.activeLayer = group;
}

groupSelected = function(name)
{
  try {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("layerSection"));
    desc1.putReference(cTID("null"), ref1);
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    desc1.putReference(cTID("From"), ref2);
    executeAction(cTID("Mk  "), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

selectLayers = function(layers)
{
  try {
    var indexes = [];

    for (var i = 0; i < layers.length; ++i) {
      indexes.push(layerIndex(layers[i]));
    }
    for (var i = 0; i < indexes.length; ++i) {
      var desc1 = new ActionDescriptor();
      var ref1 = new ActionReference();
      ref1.putIndex(cTID('Lyr '), indexes[i]);
      desc1.putReference(cTID('null'), ref1);
      desc1.putEnumerated(sTID('selectionModifier'), sTID('selectionModifierType'),
                          sTID('addToSelection'));
      desc1.putBoolean(cTID('MkVs'), false);
      executeAction(cTID('slct'), desc1, DialogModes.NO);
    }
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

groupLayers = function(name, layers)
{
  try {
    selectLayers(layers);
    return groupSelected(name);
  } catch (e) {
    log(e);
    return null;
  }
}

createLayer = function(name, layer)
{
  var layer = activateLayer(layer);
  var newLayer = app.activeDocument.artLayers.add();
  newLayer.name = name;
  app.activeDocument.activeLayer = newLayer;
  if (layer.typename == 'LayerSet') {
    newLayer.move(layer, ElementPlacement.INSIDE);
  }
  return newLayer;
}

layerIndex = function(layer)
{
  try {
    app.activeDocument.activeLayer = layer;
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('ItmI'));
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    var index = executeActionGet(ref1).getInteger(cTID('ItmI'));
    var bg = app.activeDocument.layers[app.activeDocument.layers.length-1].isBackgroundLayer;
    return (bg) ? index - 1 : index;
  } catch (e) {
    log(e);
    return -1;
  }
}

enableLayerMask = function(layer, enable)
{
  try {
    activateLayer(layer);
    var idsetd = cTID("setd");
    var desc9 = new ActionDescriptor();
    var idnull = cTID("null");
    var ref4 = new ActionReference();
    var idLyr = cTID("Lyr ");
    var idOrdn = cTID("Ordn");
    var idTrgt = cTID("Trgt");
    ref4.putEnumerated(idLyr, idOrdn, idTrgt);
    desc9.putReference(idnull, ref4);
    var idT = cTID("T   ");
    var desc10 = new ActionDescriptor();
    var idUsrM = cTID("UsrM");
    desc10.putBoolean(idUsrM, enable);
    var idLyr = cTID("Lyr ");
    desc9.putObject(idT, idLyr, desc10);
    executeAction(idsetd, desc9, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false; // No mask
  }
}

deleteLayerMask = function(layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Msk '));
    desc1.putReference(cTID('null'), ref1);
    desc1.putBoolean(cTID('MkVs'), false);
    executeAction(cTID('slct'), desc1, DialogModes.NO);

    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Dlt '), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
     return false;
  }
  return true;
}

rotateLayer = function(layer, angle)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Path'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    desc1.putEnumerated(cTID('FTcs'), cTID('QCSt'), sTID("QCSAverage"));
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), 0);
    desc2.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), 0);
    desc1.putObject(cTID('Ofst'), cTID('Ofst'), desc2);
    desc1.putUnitDouble(cTID('Angl'), cTID('#Ang'), angle);
    executeAction(cTID('Trnf'), desc1, DialogModes.NO);
  } catch (e) {
    log('rotateLayer', e.message);
    return false;
 }
  return true;
}

scaleLayer = function(layer, scale)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    desc1.putEnumerated(cTID('FTcs'), cTID('QCSt'), sTID("QCSAverage"));
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), 0);
    desc2.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), 0);
    desc1.putObject(cTID('Ofst'), cTID('Ofst'), desc2);
    desc1.putUnitDouble(cTID('Wdth'), cTID('#Prc'), scale * 100);
    desc1.putUnitDouble(cTID('Hght'), cTID('#Prc'), scale * 100);
    desc1.putBoolean(cTID('Lnkd'), true);
    desc1.putEnumerated(cTID('Intr'), cTID('Intp'), cTID('Bcbc'));
    executeAction(cTID('Trnf'), desc1, DialogModes.NO);
  } catch (e) {
    log('scaleLayer', e.message);
    return false;
  }
  return true;
}
