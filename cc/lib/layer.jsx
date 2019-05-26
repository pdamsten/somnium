//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Layer & Group handling
//
//**************************************************************************

Document.prototype.activateLayer = function(layer)
{
  this.activate();
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

LayerSet.prototype.activate = ArtLayer.prototype.activate = function()
{
  this.parent.activate();
  if (app.activeDocument.activeLayer != this) {
    app.activeDocument.activeLayer = this;
  }
  return app.activeDocument.activeLayer;
}

Document.prototype.activate = function()
{
  if (app.activeDocument != this) {
    app.activeDocument = this;
  }
  return app.activeDocument;
}

LayerSet.prototype.applyLocking = ArtLayer.prototype.applyLocking = function(transparency, composite, position, artboard)
{
  try {
    this.activate();
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

LayerSet.prototype.duplicateToDoc = ArtLayer.prototype.duplicateToDoc = function(destDoc)
{
  try {
    this.activate(); // TODO This fails. Why? Hence the two following lines.
    app.activeDocument = this.parent;
    app.activeDocument.activeLayer = this;
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

LayerSet.prototype.smartObjectInfo = ArtLayer.prototype.smartObjectInfo = function()
{
  RAW = [
  '.3fr', '.ari', '.arw', '.srf', '.sr2', '.bay', '.cri', '.crw', '.cr2', '.cr3', '.cap', '.iiq',
  '.eip', '.dcs', '.dcr', '.drf', '.k25', '.kdc', '.dng', '.erf', '.fff', '.mef', '.mdc', '.mos',
  '.mrw', '.nef', '.nrw', '.orf', '.pef', '.ptx', '.pxn', '.r3d', '.raf', '.raw', '.rw2', '.rwl',
  '.rwz', '.srw', '.x3f'
  ];

  var info = {};
  try {
    this.activate();
    if (this.kind == LayerKind.SMARTOBJECT) {
      var ref = new ActionReference();
      ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt") );
      var layerDesc = executeActionGet(ref);

      var desc = layerDesc.getObjectValue(sTID('smartObject'));
      info['fileref'] = desc.getString(sTID('fileReference'));
      info['docid'] = desc.getString(sTID('documentID'));
      info['hasFX'] = desc.hasKey(sTID("filterFX"));

      fext = info['fileref'].substr(info['fileref'].length - 4).toLowerCase();
      if (fext == '.psb') {
        info['type'] = 'photoshop';
      } else if (RAW.indexOf(fext) > -1) {
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

Document.prototype.stampVisible = function(name)
{
  try {
    this.activate();
    this.addLayer(name); // This way stamnp works also with one layer
    var desc1 = new ActionDescriptor();
    desc1.putBoolean(cTID('Dplc'), true);
    executeAction(sTID('mergeVisible'), desc1, DialogModes.NO);
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

_parentsVisible = function(layers, i)
{
  var p = layers[i].parent;
  while (p != -1) {
    if (layers[p].visible == false) {
      return false;
    }
    p = layers[p].parent;
  }
  return true;
}

Document.prototype.stampCurrentAndBelow = function(name)
{
  try {
    this.activate();
    var active = app.activeDocument.activeLayer;
    var layers = app.activeDocument.listLayers();
    // Hide layers up this layer
    for (i = 0; i < layers.length; ++i) {
      if (layers[i].layer == active) {
        break;
      }
      if (layers[i].layer.typename != 'LayerSet' && _parentsVisible(layers, i)) {
        layers[i].layer.visible = false;
      }
    }

    layer = app.activeDocument.stampVisible(name);

    // return visible state of layers
    for (i = 0; i < layers.length; ++i) {
      if (layers[i].layer == active) {
        break;
      }
      if (layers[i].layer.typename != 'LayerSet' && _parentsVisible(layers, i)) {
        layers[i].layer.visible = layers[i].visible;
      }
    }
    return layer;
  } catch (e) {
    log(e);
    return null;
  }
}

LayerSet.prototype.hasSmartFilters = function()
{
  return false;
}

ArtLayer.prototype.hasSmartFilters = function()
{
  try {
    this.activate();
    var info = this.smartObjectInfo();
    if (info == false || info['hasFX'] == false) {
      return false;
    }
    return true;
  } catch (e) {
    return false; // No smart filter
  }
}

ArtLayer.prototype.enableSmartFilters = function(enable)
{
  try {
    if (this.hasSmartFilters() == false) {
      return false;
    }
    this.activate();
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

ArtLayer.prototype.removeSmartFilters = function()
{
  try {
    this.activate();
    var info = this.smartObjectInfo();
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

LayerSet.prototype.convertToSmartObject = ArtLayer.prototype.convertToSmartObject = function(name)
{
  try {
    this.activate();
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

ArtLayer.prototype.rasterizeEx = function()
{
  try {
    this.activate();
    if (this.kind == LayerKind.SMARTOBJECT){
      executeAction(sTID("rasterizePlaced"), undefined, DialogModes.NO );
    }
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

ArtLayer.prototype.newSmartObjectViaCopy = function(name)
{
  try {
    this.activate();
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

ArtLayer.prototype.editSmartObjectContents = function()
{
  try {
    this.activate();
    var name = app.activeDocument.name;
    executeAction(sTID('placedLayerEditContents'), undefined, DialogModes.NO);
    return (name != app.activeDocument.name);
  } catch (e) {
    log(e);
    return false;
  }
}

ArtLayer.prototype.setBlendingMode = function(mode)
{
  try {
    this.activate();
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(cTID('Md  '), cTID('BlnM'), Photoshop.blendingMode(mode));
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

Document.prototype.listLayers = function(player, _pindex)
{
  try {
    this.activate();
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
        this.listLayers(layer, _lindex - 1);
      }
    }
    return _layersList;
  } catch (e) {
    log(e);
    return null;
  }
}

LayerSet.prototype.compare = ArtLayer.prototype.compare = function(layer)
{
  if (typeof this === 'undefined' || typeof layer === 'undefined') {
    return false;
  }
  if (typeof this !== 'string' && typeof layer !== 'string') {
    return (this == layer);
  }
  if (typeof this !== 'string') {
    return (this.name == layer);
  }
  if (typeof layer !== 'string') {
    return (this == layer.name);
  }
  //log(layer1.name, layer2.name, (layer1 == layer2));
  return (this == layer);
}

Document.prototype.findLayer = function(name, parent, type)
{
  try {
    this.activate();
    layers = this.listLayers();

    for (var i = 0; i < layers.length; ++i) {
      if (layers[i].layer.name == name) {
        if (typeof parent !== 'undefined' && layers[i].parent != -1 &&
                    !(layers[layers[i].parent].layer.compare(parent))) {
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

Document.prototype.checkLayer = function(name, parent)
{
  try {
    this.activate();
    var layer = this.findLayer(name, parent);
    if (layer != null) {
      var v = layer.visible;
      app.activeDocument.activeLayer = layer;
      app.activeDocument.activeLayer.visible = v;
      return layer;
    }
  } catch (e) {
    log(e);
  }
  return null;
}

Document.prototype.addLayer = function(name, layer, placement)
{
  try {
    this.activate();
    name = (name == undefined) ? String.random(8) : name;
    layer = (layer == undefined) ? app.activeDocument.activeLayer : layer;
    placement = (placement == undefined) ? ElementPlacement.PLACEBEFORE : placement;
    app.activeDocument.activeLayer = layer;
    var newLayer = app.activeDocument.artLayers.add();
    newLayer.name = name;
    app.activeDocument.activeLayer = newLayer;
    newLayer.move(layer, placement);
    return newLayer;
  } catch (e) {
    log(e);
  }
  return null;
}

Document.prototype.mergeLayers = function(layers)
{
  try {
    this.activate();
    if (this.selectLayers(layers)) {
      var desc1 = new ActionDescriptor();
      executeAction(cTID("Mrg2"), desc1, DialogModes.NO);
      return app.activeDocument.activeLayer;
    }
  } catch (e) {
    log(e);
  }
  return null;
}

Document.prototype.findGroup = function(name, parent)
{
  return this.findLayer(name, parent, 'LayerSet');
}

LayerSet.prototype.activate = ArtLayer.prototype.moveToGroup = function(group)
{
  if (group && group.typename == 'LayerSet') {
    var before = group.layerSets.add();
    this.move(before, ElementPlacement.PLACEBEFORE); // Does not support ElementPlacement.INSIDE
    before.remove();
  }
}

Document.prototype.addGroup = function(name)
{
  this.activate();
  name = (name == undefined) ? String.random(8) : name;
  var layerActive = app.activeDocument.activeLayer;
  var group = app.activeDocument.layerSets.add();
  group.name = name;
  app.activeDocument.activeLayer = group;
  return group;
}

Document.prototype.checkGroup = function(name, parent, after)
{
  try {
    this.activate();
    if (parent !== undefined) {
      parent = this.checkGroup(parent);
    }
    var group = this.findGroup(name, parent);
    if (group == null) {
      group = this.addGroup(name, parent);
      if (after !== undefined) {
        after = this.findLayer(after);
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

Document.prototype.groupSelectedLayers = function(name)
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

Document.prototype.selectLayers = function(layers)
{
  try {
    this.activate();
    var indexes = [];

    for (var i = 0; i < layers.length; ++i) {
      indexes.push(layers[i].index());
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

Document.prototype.groupLayers = function(name, layers)
{
  try {
    this.activate();
    this.selectLayers(layers);
    return this.groupSelectedLayers(name);
  } catch (e) {
    log(e);
    return null;
  }
}

ArtLayer.prototype.index = function()
{
  try {
    this.activate();
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

ArtLayer.prototype.duplicateEx = function(name)
{
  try {
    name = (name == undefined) ? String.random(8) : name;
    this.activate();
    executeAction(sTID('copyToLayer'), undefined, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

LayerSet.prototype.activateMask = ArtLayer.prototype.activateMask = function()
{
  try {
    this.activate();
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Msk '));
    desc1.putReference(cTID('null'), ref1);
    desc1.putBoolean(cTID('MkVs'), false);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
  } catch (e) {
    log(e);
    return false; // No mask
  }
  return true;
}

ArtLayer.prototype.activateRGB = function()
{
  try {
    this.activate();
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

ArtLayer.prototype.invertEx = function()
{
  try {
    selectLayerRGB(this);
    executeAction(cTID('Invr'), undefined, DialogModes.NO);
  } catch (e) {
    log(e);
    return false;
  }
  return true;
}

ArtLayer.prototype.fill = function(color)
{
  colors = {'gray': cTID('Gry ')};
  try {
    this.activate();
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

ArtLayer.prototype.rotate = function(angle)
{
  try {
    this.activate();
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

ArtLayer.prototype.scale = function(scale)
{
  try {
    this.activate();
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
