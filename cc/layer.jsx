//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Layer & Group handling
//
//**************************************************************************

applyLocking = function(layer, transparency, composite, position, artboard)
{
  try {
    layer = activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    if (transparency && composite && position && artboard) {
      desc2.putBoolean(sTID("protectAll"), true);
    }
    if (transparency) {
      desc2.putBoolean(sTID("protectTransparency"), transparency);
    }
    if (composite) {
      desc2.putBoolean(sTID("protectComposite"), composite);
    }
    if (position) {
      desc2.putBoolean(sTID("protectPosition"), position);
    }
    if (artboard) {
      desc2.putBoolean(sTID("protectArtboardAutonest"), artboard);
    }
    desc1.putObject(sTID("layerLocking"), sTID("layerLocking"), desc2);
    executeAction(sTID('applyLocking'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
  }
  return false;
};

duplicateLayerToDoc = function(layer, destDoc) {
  try {
    layer = activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putName(cTID('Dcmn'), destDoc);
    desc1.putReference(cTID('T   '), ref2);
    desc1.putInteger(cTID('Vrsn'), 5);
    var list1 = new ActionList();
    list1.putInteger(59);
    desc1.putList(cTID('Idnt'), list1);
    executeAction(cTID('Dplc'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
  }
  return false;
};

smartObjectInfo = function(layer)
{
  RAW = [
  '.3fr', '.ari', '.arw', '.srf', '.sr2', '.bay', '.cri', '.crw', '.cr2', '.cr3', '.cap', '.iiq',
  '.eip', '.dcs', '.dcr', '.drf', '.k25', '.kdc', '.dng', '.erf', '.fff', '.mef', '.mdc', '.mos',
  '.mrw', '.nef', '.nrw', '.orf', '.pef', '.ptx', '.pxn', '.r3d', '.raf', '.raw', '.rw2', '.rwl',
  '.rwz', '.srw', '.x3f'
  ];

  var info = {};
  try {
    layer = activateLayer(layer);
    if (layer.kind == LayerKind.SMARTOBJECT) {
      var ref = new ActionReference();
      ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt") );
      var layerDesc = executeActionGet(ref);

      var desc = layerDesc.getObjectValue(sTID('smartObject'));
      info['fileref'] = desc.getString(sTID('fileReference'));
      info['docid'] = desc.getString(sTID('documentID'));
      info['hasFX'] = desc.hasKey(sTID("filterFX"));

      ext = info['fileref'].substr(info['fileref'].length - 4).toLowerCase();
      if (ext == '.psb') {
        info['type'] = 'photoshop';
      } else if (arrayContains(RAW, ext)) {
        info['type'] = 'raw';
      } else {
        info['type'] = 'bitmap';
      }
      /*
      var more = layerDesc.getObjectValue(stringIDToTypeID('smartObjectMore'));
      var size = more.getObjectValue(stringIDToTypeID('size'));
      */
      return info;
    }
  } catch (e) {
    log(e);
  }
  return false;
}

stampVisible = function(name, layer)
{
  try {
    createLayer(name, layer, false); // This way stamnp works also with one layer
    var desc1 = new ActionDescriptor();
    desc1.putBoolean(cTID('Dplc'), true);
    executeAction(sTID('mergeVisible'), desc1, DialogModes.NO);
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

stampCurrentAndBelow = function(layer, name)
{
  try {
    var active = activateLayer(layer);
    var group = layer;
    var layers = listLayers();
    // Hide layers up this layer
    for (i = 0; i < layers.length; ++i) {
      if (layers[i].layer == active) {
        break;
      }
      if (layers[i].layer.typename != 'LayerSet') {
        layers[i].layer.visible = false;
      }
    }

    layer = stampVisible(name, active);

    // return visible state of layers
    for (i = 0; i < layers.length; ++i) {
      if (layers[i].layer == active) {
        break;
      }
      if (layers[i].layer.typename != 'LayerSet') {
        layers[i].layer.visible = layers[i].visible;
      }
    }
    return layer;
  } catch (e) {
    log(e);
    return null;
  }
}

hasSmartFilters = function(layer)
{
  try {
    layer = activateLayer(layer);
    var info = smartObjectInfo(layer);
    if (info == false || info['hasFX'] == false) {
      return false;
    }
  } catch (e) {
    return false; // No smart filter
  }
}

enableSmartFilters = function(layer, enable)
{
  try {
    if (hasSmartFilters(layer) == false) {
      return false;
    }
    layer = activateLayer(layer);
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
    layer = activateLayer(layer);
    var info = smartObjectInfo(layer);
    if (info == false || info['hasFX'] == false) {
      return false;
    }
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

convertToSmartObject = function(layer, name)
{
  try {
    activateLayer(layer);
    executeAction(sTID('newPlacedLayer'), undefined, DialogModes.NO);
    if (name !== undefined && name != '') {
      app.activeDocument.activeLayer.name = name;
    }
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

newSmartObjectViaCopy = function(layer, name)
{
  try {
    activateLayer(layer);
    executeAction(sTID('placedLayerMakeCopy'), undefined, DialogModes.NO);
    if (name !== undefined && name != '') {
      app.activeDocument.activeLayer.name = name;
    }
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

editSmartObjectContents = function(layer)
{
  try {
    activateLayer(layer);
    var name = app.activeDocument.name;
    executeAction(sTID('placedLayerEditContents'), undefined, DialogModes.NO);
    return (name != app.activeDocument.name);
  } catch (e) {
    log(e);
    return false;
  }
}

setLayerBlendingMode = function(layer, mode)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(cTID('Md  '), cTID('BlnM'), blendingMode(mode));
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

var _layersList = [];
var _lindex = 0;

listLayers = function(player, _pindex)
{
  try {
    if (typeof _pindex === 'undefined') {
      _pindex = -1;
      _layersList = [];
      _lindex = 0;
    }
    player = (typeof player === 'undefined') ? app.activeDocument : player;

    for (var i = 0; i < player.layers.length; ++i) {
      var layer = player.layers[i];
      _layersList[_lindex++] = {'parent': _pindex, 'layer': layer, 'visible': layer.visible};
      if (layer.typename == 'LayerSet') {
        listLayers(layer, _lindex - 1);
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
    } else if (typeof layer === 'string' && layer == 'current') {
        return app.activeDocument.activeLayer;
    } else if (typeof layer === 'string' && layer == 'last') {
      app.activeDocument.activeLayer = app.activeDocument.layers[app.activeDocument.layers.length - 1];
    } else {
      app.activeDocument.activeLayer = layer;
    }
  }
  return app.activeDocument.activeLayer;
}

cmpLayers = function(layer1, layer2)
{
  if (typeof layer1 === 'undefined' || typeof layer2 === 'undefined') {
    return false;
  }
  if (typeof layer1 !== 'string' && typeof layer2 !== 'string') {
    return (layer1 == layer2);
  }
  if (typeof layer1 !== 'string') {
    return (layer1.name == layer2);
  }
  if (typeof layer2 !== 'string') {
    return (layer1 == layer2.name);
  }
  //log(layer1.name, layer2.name, (layer1 == layer2));
  return (layer1 == layer2);
}

findLayer = function(name, parent, type)
{
  try {
    layers = listLayers();

    for (var i = 0; i < layers.length; ++i) {
      if (layers[i].layer.name == name) {
        if (typeof parent !== 'undefined' && layers[i].parent != -1 &&
            !cmpLayers(layers[layers[i].parent].layer, parent)) {
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

createLayer = function(name, layer)
{
  var layer = activateLayer(layer);
  var newLayer = app.activeDocument.artLayers.add();
  newLayer.name = name;
  app.activeDocument.activeLayer = newLayer;
  newLayer.move(layer, ElementPlacement.PLACEBEFORE);
  return newLayer;
}

findGroup = function(name, parent)
{
  return findLayer(name, parent, 'LayerSet');
}

moveToGroup = function(layer, group)
{
  if (group.typename == 'LayerSet') {
    var before = group.layerSets.add();
    layer.move(before, ElementPlacement.PLACEBEFORE); // Does not support ElementPlacement.INSIDE
    before.remove();
  }
}

createGroup = function(name, layer)
{
  var layerActive = activateLayer(layer);
  var group = app.activeDocument.layerSets.add();
  group.name = name;
  app.activeDocument.activeLayer = group;
  if (typeof layer === 'object' &&  layerActive.typename == 'LayerSet') {
    moveToGroup(group, layerActive)
  }
  return group;
}

checkGroup = function(name, parent, after)
{
  try {
    if (parent !== undefined) {
      parent = checkGroup(parent);
    }
    var group = findGroup(name, parent);
    if (group == null) {
      group = createGroup(name, parent);
      if (after !== undefined) {
        after = findLayer(after);
        if (parent && after) {
          parent.move(after, ElementPlacement.PLACEAFTER);
        } else if (group && after) {
          group.move(after, ElementPlacement.PLACEAFTER);
        }
      }
    }
    app.activeDocument.activeLayer = group;
    return group;
  } catch (e) {
    log(e);
    return null;
  }
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

layerIndex = function(layer)
{
  try {
    app.activeDocument.activeLayer = layer;
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('ItmI'));
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    var index = executeActionGet(ref1).getInteger(cTID('ItmI'));
    var bg = app.activeDocument.layers[app.activeDocument.layers.length - 1].isBackgroundLayer;
    return (bg) ? index - 1 : index;
  } catch (e) {
    log(e);
    return -1;
  }
}

duplicateLayer = function(layer, name)
{
  try {
    activateLayer(layer);
    executeAction(sTID('copyToLayer'), undefined, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

selectLayerRGB = function(layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('RGB'));
    desc1.putReference(cTID('null'), ref1);
    desc1.putBoolean(cTID('MkVs'), false);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

invertLayer = function(layer)
{
  try {
    selectLayerRGB(layer);
    executeAction(cTID('Invr'), undefined, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

fillLayer = function(layer, color)
{
  colors = {'gray': cTID('Gry ')};
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    desc1.putEnumerated(cTID('Usng'), cTID('FlCn'), colors[color]);
    desc1.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100);
    desc1.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    executeAction(cTID('Fl  '), desc1, DialogModes.NO);
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
    log(e);
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
