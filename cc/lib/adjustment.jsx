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

ArtLayer.prototype.applyGaussianBlurEx = function(value, withDialog)
{
  try {
    this.activate();
    var dialogMode = (typeof withDialog === 'undefined' || withDialog) ? DialogModes.ALL : DialogModes.NO;
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(cTID('Rds '), cTID('#Pxl'), value);
    executeAction(sTID('gaussianBlur'), desc1, dialogMode);
  } catch (e) {
    log(e);
  }
}

ArtLayer.prototype.applySurfaceBlur = function(radius, treshold, withDialog)
{
  try {
    this.activate();
    var dialogMode = (typeof withDialog === 'undefined' || withDialog) ? DialogModes.ALL : DialogModes.NO;
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(sTID("radius"), sTID("pixelsUnit"), radius);
    desc1.putInteger(sTID("threshold"), treshold);
    executeAction(sTID("surfaceBlur"), desc1, dialogMode);
  } catch (e) {
    log(e);
  }
}

const NoiseTypes = {'gaussian': 'Gsn ', 'uniform': 'Unfr'};

ArtLayer.prototype.applyAddNoiseEx = function(value, type, mono, withDialog)
{
  try {
    this.activate();
    var dialogMode = (typeof withDialog === 'undefined' || withDialog) ? DialogModes.ALL : DialogModes.NO;
    var desc1 = new ActionDescriptor();
    desc1.putEnumerated(cTID('Dstr'), cTID('Dstr'), cTID(NoiseTypes[type]));
    desc1.putUnitDouble(cTID('Nose'), cTID('#Prc'), value);
    desc1.putBoolean(cTID('Mnch'), mono);
    desc1.putInteger(cTID('FlRs'), 31237892);
    executeAction(sTID('addNoise'), desc1, dialogMode);
  } catch (e) {
    log(e);
  }
}

ArtLayer.prototype.adjustLevelsEx = function(value, withDialog)
{
  try {
    this.activate();
    var dialogMode = (typeof withDialog === 'undefined' || withDialog) ? DialogModes.ALL : DialogModes.NO;
    var desc1 = new ActionDescriptor();
    desc1.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
    var list1 = new ActionList();
    var desc2 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Ordn'), cTID('Trgt'));
    desc2.putReference(cTID('Chnl'), ref1);
    var list2 = new ActionList();
    list2.putInteger(value[0][0]);
    list2.putInteger(value[0][1]);
    desc2.putList(cTID('Inpt'), list2);
    desc2.putDouble(cTID('Gmm '), value[0][2]);
    var list3 = new ActionList();
    list3.putInteger(value[1][0]);
    list3.putInteger(value[1][1]);
    desc2.putList(cTID('Otpt'), list3);
    list1.putObject(cTID('LvlA'), desc2);
    desc1.putList(cTID('Adjs'), list1);
    executeAction(cTID('Lvls'), desc1, dialogMode);
  } catch (e) {
    log(e);
  }
}

ArtLayer.prototype.applyHighPassEx = function(value, withDialog)
{
  try {
    this.activate();
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(cTID('Rds '), cTID('#Pxl'), value);
    executeAction(sTID('highPass'), desc1, dialogMode);
  } catch (e) {
    log(e);
  }
}

ArtLayer.prototype.applyImage = function(values, withDialog)
{
  try {
    this.activate();
    var dialogMode = (typeof withDialog === 'undefined' || withDialog) ? DialogModes.ALL : DialogModes.NO;
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), sTID(values[0]));
    ref1.putName(cTID('Lyr '), values[1]);
    desc2.putReference(cTID('T   '), ref1);
    desc2.putEnumerated(cTID('Clcl'), cTID('Clcn'), Photoshop.blendingMode(values[2]));
    desc2.putDouble(cTID('Scl '), values[3]);
    desc2.putInteger(cTID('Ofst'), values[4]);
    desc1.putObject(cTID('With'), cTID('Clcl'), desc2);
    executeAction(sTID('applyImageEvent'), desc1, dialogMode);
  } catch (e) {
    log(e);
  }
}
