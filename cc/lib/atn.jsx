//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Atn file handling
//
//**************************************************************************

Atn = (function() {

const volume = 'Macintosh HD';
const data1 = [0,  0,  0,  0,  66,  68,  0,  1,  255,  255,  255,  255];
const data2 = [255,  255,  255,  255,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,
               2, 0,  0,  10,  32,  99,  117,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0];
const data3 = [19,  0,  1,  47,  0,  0,  21,  0,  2,  0,  11,  255,  255,  0,  0];

return { // public:

writeArray: function(f, array)
{
  for (var i = 0; i < array.length; ++i) {
    f.write(String.fromCharCode(array[i]));
  }
},

writeNumber: function(f, number, bytes, littleendian)
{
  var array = [];
  if (littleendian) {
    for (var i = 0; i < bytes; ++i) {
      array[i] = number & 255;
      number = number >> 8;
    }
  } else {
    for (var i = bytes - 1; i >= 0; --i) {
      array[i] = number & 255;
      number = number >> 8;
    }
  }
  this.writeArray(f, array);
},

writeLong: function(f, number, littleendian)
{
  this.writeNumber(f, number, 4, littleendian);
},

writeShort: function(f, number, littleendian)
{
  this.writeNumber(f, number, 2, littleendian);
},

writeBoolean: function(f, number)
{
  this.writeNumber(f, number, 1);
},

writeByte: function(f, number)
{
  this.writeNumber(f, number, 1);
},

writeUnicodeString: function(f, str, littleendian)
{
  var length = str.length;
  this.writeLong(f, length + 1, littleendian);
  for (var j = 0; j < length; ++j) {
    this.writeShort(f, str.charCodeAt(j), littleendian);
  }
  this.writeShort(f, 0);
},

writeByteString: function(f, str)
{
  var length = str.length;
  this.writeLong(f, length + 1);
  for (var j = 0; j < length; ++j) {
    this.writeByte(f, str.charCodeAt(j));
  }
  this.writeByte(f, 0);
},

write4ByteID: function(f, id, littleendian)
{
  if (littleendian) {
    for (var j = 3; j >= 0; --j) {
      f.write(id[j]);
    }
  } else {
    for (var j = 0; j < 4; ++j) {
      f.write(id[j]);
    }
  }
},

writeStringID: function(f, str)
{
  this.write4ByteID(f, 'TEXT');
  this.writeByteString(f, str);
},

writeCharID: function(f, str)
{
  this.writeLong(f, 0);
  this.write4ByteID(f, str);
},

writeClass: function(f)
{
  this.writeUnicodeString(f, '');
  this.writeCharID(f, 'null');
},

// alis

writeAlisByteString: function(f, str)
{
  var length = str.length;
  this.writeShort(f, length);
  for (var j = 0; j < length; ++j) {
    this.writeByte(f, str.charCodeAt(j));
  }
  this.writeByte(f, 0);
},

writeAlisUnicodeString: function(f, str)
{
  var length = str.length;
  this.writeShort(f, length); // name length
  for (var j = 0; j < length; ++j) {
    this.writeShort(f, str.charCodeAt(j));
  }
  this.writeByte(f, 0);
},

writeAlisPaddedByteString: function(f, str, total)
{
  var length = str.length;
  this.writeByte(f, length);
  for (var j = 0; j < length; ++j) {
    this.writeByte(f, str.charCodeAt(j));
  }
  for (var j = length; j < total; ++j) {
    this.writeByte(f, 0);
  }
},

alisLength: function(script)
{
  var file = File(script);
  var folder = File(file.path);

  return 191 + folder.name.length + script.length + 1 + file.name.length * 2 +
         volume.length * 2 + script.length - 1 + ((script.length + 1) % 2) * 2;
},

writeAlis: function(f, script)
{
  var file = File(script);
  var folder = File(file.path);

  var length = this.alisLength(script);

  this.writeShort(f, 0); // ?
  this.writeLong(f, length); // length of all data
  this.writeShort(f, 2); // ?
  this.writeShort(f, 0); // ?
  this.writeAlisPaddedByteString(f, volume, 27); // Volume name
  this.writeArray(f, data1); // Some volume specific shit. Works with Macintosh HD only.
  this.writeAlisPaddedByteString(f, file.name, 63); // Script name
  this.writeArray(f, data2); // Again some volume specific shit.
  this.writeAlisByteString(f, folder.name); // Containing folder name (not path)
  this.writeShort(f, 2); // ?
  this.writeAlisByteString(f, '/' + script.replace(/\//g , ':'));
  if ((script.length % 2) == 0) {
    this.writeByte(f, 0);
  }
  this.writeByte(f, 14); // ?
  this.writeShort(f, (file.name.length + 1) * 2); // data length ?
  this.writeAlisUnicodeString(f, file.name);
  this.writeByte(f, 15); // ?
  this.writeShort(f, 26); // ?
  this.writeAlisUnicodeString(f, volume);
  this.writeByte(f, 18); // ?
  this.writeAlisByteString(f, script.substring(1));
  if ((script.length % 2) == 0) {
    this.writeByte(f, 0);
  }
  this.writeArray(f, data3); // end shit
},

writePth: function(f, script)
{
  this.write4ByteID(f, 'utxt', true);
  this.writeLong(f, script.length * 2 + 12, true);
  this.writeUnicodeString(f, script, true);
},

writePair: function(f, type, data)
{
  this.write4ByteID(f, type);
  if (type == 'TEXT') {
    this.writeUnicodeString(f, data);
  } else if (type == 'alis') {
    this.writeLong(f, this.alisLength(data));
    this.writeAlis(f, data);
  } else if (type == 'Pth ') {
    this.writeLong(f, data.length * 2 + 12);
    this.writePth(f, data);
  }
},

writeDescriptor: function(f, script)
{
  this.writeClass(f);
  this.writeLong(f, 2); // Items
  this.writeCharID(f, 'jsCt');
  if (isMac() >= 0) {
    this.writePair(f, 'alis', script);
  } else {
    this.writePair(f, 'Pth ', script);
  }
  this.writeCharID(f, 'jsMs');
  this.writePair(f, 'TEXT', 'undefined');
},

writeCommand: function(f, script)
{
  this.writeBoolean(f, 0); // Expanded
  this.writeBoolean(f, 1); // Enabled
  this.writeBoolean(f, 0); // Dialog
  this.writeByte(f, 0); // Dialog options
  this.writeStringID(f, 'AdobeScriptAutomation Scripts'); // ID
  this.writeByteString(f, 'Scripts'); // Dictionary
  this.writeLong(f, -1); // Descriptor
  this.writeDescriptor(f, script);
},

fileName: function(n)
{
  return n.replace(/[^0-9a-zA-Z-_]/gi , '');
},

writeAction: function(f, setting, actions)
{
  this.writeShort(f, 0); // Function key
  this.writeBoolean(f, 0); // Shift
  this.writeBoolean(f, 0); // Command
  this.writeShort(f, 0); // Color
  var name = setting.group + ' - ' + setting.title;
  this.writeUnicodeString(f, name); // Name
  this.writeBoolean(f, 0); // Expanded
  this.writeLong(f, 1); // Command count
  this.writeCommand(f, actions + this.fileName(name) + '.jsx');
},

writeActionSet: function(f, settings, actions)
{
  this.writeUnicodeString(f, 'Somnium'); // set name
  this.writeBoolean(f, 0); // expanded
  var a = 0;
  for (var key in settings) {
    if (settings[key].group != undefined) {
      ++a;
    }
  }
  this.writeLong(f, a); // action count
  for (var key in settings) {
    if (settings[key].group != undefined) {
      this.writeAction(f, settings[key], actions);
    }
  }
},

write: function(filename, settings, actions)
{
  try {
    var f = new File(filename);
    f.open('w');
    f.encoding = "BINARY";
    this.writeLong(f, 16); // Version
    this.writeActionSet(f, settings, actions);
    f.close();
  } catch (e) {
    log(e);
  }
},

unloadActionsSet: function(actionSet) {
  try {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putName(charIDToTypeID("ASet"), decodeURI(actionSet));
    desc.putReference(charIDToTypeID("null"), ref);
    executeAction(charIDToTypeID("Dlt "), desc, DialogModes.NO);
  } catch (err) {
    return false;
  }
  return true;
},

check: function(path, pluginPath, settings)
{
  var atnFile = path + 'somnium-' + settings.version() + '.atn';
  var actions = addPathSep(pluginPath + 'actions');
  var f = File(atnFile);

  if (!f.exists) {
    this.write(atnFile, settings.constantData(), actions);

    this.unloadActionsSet('Somnium');
    app.load(new File(atnFile));
  }
}

};})();
