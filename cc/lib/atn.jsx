//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Atn file handling
//
//**************************************************************************

Atn = (function() {

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
  writeArray(f, array);
},

writeLong: function(f, number, littleendian)
{
  writeNumber(f, number, 4, littleendian);
},

writeShort: function(f, number, littleendian)
{
  writeNumber(f, number, 2, littleendian);
},

writeBoolean: function(f, number)
{
  writeNumber(f, number, 1);
},

writeByte: function(f, number)
{
  writeNumber(f, number, 1);
},

writeUnicodeString: function(f, str, littleendian)
{
  var length = str.length;
  writeLong(f, length + 1, littleendian);
  for (var j = 0; j < length; ++j) {
    writeShort(f, str.charCodeAt(j), littleendian);
  }
  writeShort(f, 0);
},

writeByteString: function(f, str)
{
  var length = str.length;
  writeLong(f, length + 1);
  for (var j = 0; j < length; ++j) {
    writeByte(f, str.charCodeAt(j));
  }
  writeByte(f, 0);
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
  write4ByteID(f, 'TEXT');
  writeByteString(f, str);
},

writeCharID: function(f, str)
{
  writeLong(f, 0);
  write4ByteID(f, str);
},

writeClass: function(f)
{
  writeUnicodeString(f, '');
  writeCharID(f, 'null');
},

// alis

writeAlisByteString: function(f, str)
{
  var length = str.length;
  writeShort(f, length);
  for (var j = 0; j < length; ++j) {
    writeByte(f, str.charCodeAt(j));
  }
  writeByte(f, 0);
},

writeAlisUnicodeString: function(f, str)
{
  var length = str.length;
  writeShort(f, length); // name length
  for (var j = 0; j < length; ++j) {
    writeShort(f, str.charCodeAt(j));
  }
  writeByte(f, 0);
},

writeAlisPaddedByteString: function(f, str, total)
{
  var length = str.length;
  writeByte(f, length);
  for (var j = 0; j < length; ++j) {
    writeByte(f, str.charCodeAt(j));
  }
  for (var j = length; j < total; ++j) {
    writeByte(f, 0);
  }
},

volume: 'Macintosh HD',
data1: [0,  0,  0,  0,  66,  68,  0,  1,  255,  255,  255,  255],
data2: [255,  255,  255,  255,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  2,
             0,  0,  10,  32,  99,  117,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0],
data3: [19,  0,  1,  47,  0,  0,  21,  0,  2,  0,  11,  255,  255,  0,  0],

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

  var length = alisLength(script);

  writeShort(f, 0); // ?
  writeLong(f, length); // length of all data
  writeShort(f, 2); // ?
  writeShort(f, 0); // ?
  writeAlisPaddedByteString(f, volume, 27); // Volume name
  writeArray(f, data1); // Some volume specific shit. Works with Macintosh HD only.
  writeAlisPaddedByteString(f, file.name, 63); // Script name
  writeArray(f, data2); // Again some volume specific shit.
  writeAlisByteString(f, folder.name); // Containing folder name (not path)
  writeShort(f, 2); // ?
  writeAlisByteString(f, '/' + script.replace(/\//g , ':'));
  if ((script.length % 2) == 0) {
    writeByte(f, 0);
  }
  writeByte(f, 14); // ?
  writeShort(f, (file.name.length + 1) * 2); // data length ?
  writeAlisUnicodeString(f, file.name);
  writeByte(f, 15); // ?
  writeShort(f, 26); // ?
  writeAlisUnicodeString(f, volume);
  writeByte(f, 18); // ?
  writeAlisByteString(f, script.substring(1));
  if ((script.length % 2) == 0) {
    writeByte(f, 0);
  }
  writeArray(f, data3); // end shit
},

writePth: function(f, script)
{
  write4ByteID(f, 'utxt', true);
  writeLong(f, script.length * 2 + 12, true);
  writeUnicodeString(f, script, true);
},

writePair: function(f, type, data)
{
  write4ByteID(f, type);
  if (type == 'TEXT') {
    writeUnicodeString(f, data);
  } else if (type == 'alis') {
    writeLong(f, alisLength(data));
    writeAlis(f, data);
  } else if (type == 'Pth ') {
    writeLong(f, data.length * 2 + 12);
    writePth(f, data);
  }
},

writeDescriptor: function(f, script)
{
  writeClass(f);
  writeLong(f, 2); // Items
  writeCharID(f, 'jsCt');
  if (isMac() >= 0) {
    writePair(f, 'alis', script);
  } else {
    writePair(f, 'Pth ', script);
  }
  writeCharID(f, 'jsMs');
  writePair(f, 'TEXT', 'undefined');
},

writeCommand: function(f, script)
{
  writeBoolean(f, 0); // Expanded
  writeBoolean(f, 1); // Enabled
  writeBoolean(f, 0); // Dialog
  writeByte(f, 0); // Dialog options
  writeStringID(f, 'AdobeScriptAutomation Scripts'); // ID
  writeByteString(f, 'Scripts'); // Dictionary
  writeLong(f, -1); // Descriptor
  writeDescriptor(f, script);
},

writeAction: function(f, setting, actions)
{
  writeShort(f, 0); // Function key
  writeBoolean(f, 0); // Shift
  writeBoolean(f, 0); // Command
  writeShort(f, 0); // Color
  var name = setting.group + ' - ' + setting.title;
  writeUnicodeString(f, name); // Name
  writeBoolean(f, 0); // Expanded
  writeLong(f, 1); // Command count
  writeCommand(f, actions + name.replace(/ /g , '') + '.jsx');
},

writeActionSet: function(f, settings, actions)
{
  writeUnicodeString(f, 'Somnium'); // set name
  writeBoolean(f, 0); // expanded
  writeLong(f, dicLength(settings)); // action count
  for (var key in settings) {
    writeAction(f, settings[key], actions);
  }
},

write: function(filename, settings, actions)
{
  try {
    var f = new File(filename);
    f.open('w');
    f.encoding = "BINARY";
    writeLong(f, 16); // Version
    writeActionSet(f, settings, actions);
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
    writeAtn(atnFile, settings.constantData(), actions);

    unloadActionsSet('Somnium');
    app.load(new File(atnFile));
  }
}

};})();