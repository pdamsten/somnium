//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Atn file handling
//
//**************************************************************************

writeArray = function(f, array)
{
  for (var i = 0; i < array.length; ++i) {
    f.write(String.fromCharCode(array[i]));
  }
}

writeNumber = function(f, number, bytes)
{
  var array = [];
  for (var i = bytes - 1; i >= 0; --i) {
    array[i] = number & 255;
    number = number >> 8;
  }
  writeArray(f, array);
}

writeLong = function(f, number)
{
  writeNumber(f, number, 4);
}

writeShort = function(f, number)
{
  writeNumber(f, number, 2);
}

writeBoolean = function(f, number)
{
  writeNumber(f, number, 1);
}

writeByte = function(f, number)
{
  writeNumber(f, number, 1);
}

writeUnicodeString = function(f, str)
{
  var length = str.length;
  writeLong(f, length + 1);
  for (var j = 0; j < length; ++j) {
    writeShort(f, str.charCodeAt(j));
  }
  writeShort(f, 0);
}

writeByteString = function(f, str)
{
  var length = str.length;
  writeLong(f, length + 1);
  for (var j = 0; j < length; ++j) {
    writeByte(f, str.charCodeAt(j));
  }
  writeByte(f, 0);
}

write4ByteID = function(f, id)
{
  for (var j = 0; j < 4; ++j) {
    f.write(id[j]);
  }
}

writeStringID = function(f, str)
{
  write4ByteID(f, 'TEXT');
  writeByteString(f, str);
}

writeCharID = function(f, str)
{
  writeLong(f, 0);
  write4ByteID(f, str);
}

writeClass = function(f)
{
  writeUnicodeString(f, '');
  writeCharID(f, 'null');
}

// alis

writeAlisByteString = function(f, str)
{
  var length = str.length;
  writeShort(f, length);
  for (var j = 0; j < length; ++j) {
    writeByte(f, str.charCodeAt(j));
  }
  writeByte(f, 0);
}

writeAlisUnicodeString = function(f, str)
{
  var length = str.length;
  writeShort(f, length); // name length
  for (var j = 0; j < length; ++j) {
    writeShort(f, str.charCodeAt(j));
  }
}

writePaddedByteString = function(f, str, total)
{
  var length = str.length;
  writeByte(f, length);
  for (var j = 0; j < length; ++j) {
    writeByte(f, str.charCodeAt(j));
  }
  for (var j = length; j < total; ++j) {
    writeByte(f, 0);
  }
}

var volume = 'Macintosh HD';
var data1 = [0,  0,  0,  0,  66,  68,  0,  1,  255,  255,  255,  255];
var data2 = [255,  255,  255,  255,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  2,
             0,  0,  10,  32,  99,  117,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 0, 0];
var data3 = [0,  19,  0,  1,  47,  0,  0,  21,  0,  2,  0,  11,  255,  255,  0,  0];
var script = '/Users/damu/tmp/02.jsx';

alisLength = function(script)
{
  var file = File(script);
  var folder = File(file.path);

  return 193 + folder.name.length + script.length + 1 + file.name.length * 2 +
         volume.length * 2 + script.length - 1;
}

writeAlis = function(f, script)
{
  var file = File(script);
  var folder = File(file.path);

  var length = alisLength(script);

  writeShort(f, 0); // ?
  writeLong(f, length); // length of all data
  writeShort(f, 2); // ?
  writeShort(f, 0); // ?
  writePaddedByteString(f, volume, 27); // Volume name
  writeArray(f, data1); // Some volume specific shit. Works with Macintosh HD only.
  writePaddedByteString(f, file.name, 63); // Script name
  writeArray(f, data2); // Again some volume specific shit.
  writeAlisByteString(f, folder.name); // Containing folder name (not path)
  writeShort(f, 2); // ?
  writeAlisByteString(f, '/' + script.replace("/", ":"));
  writeShort(f, 14); // ?
  writeShort(f, (file.name.length + 1) * 2); // data length ?
  writeAlisUnicodeString(f, file.name);
  writeShort(f, 15); // ?
  writeShort(f, 26); // ?
  writeAlisUnicodeString(f, volume);
  writeShort(f, 18); // ?
  writeAlisByteString(f, script.substring(1));
  writeArray(f, data3); // end shit
}

writePair = function(f, type, data)
{
  write4ByteID(f, type);
  if (type == 'TEXT') {
    writeUnicodeString(f, data);
  } else if (type == 'alis') {
    writeLong(f, alisLength(data));
    writeAlis(f, data);
  }
}

writeDescriptor = function(f)
{
  writeClass(f);
  writeLong(f, 2); // Items
  writeCharID(f, 'jsCt');
  writePair(f, 'alis', script);
  writeCharID(f, 'jsMs');
  writePair(f, 'TEXT', 'undefined');
}

writeCommand = function(f)
{
  writeBoolean(f, 0); // Expanded
  writeBoolean(f, 1); // Enabled
  writeBoolean(f, 0); // Dialog
  writeByte(f, 0); // Dialog options
  writeStringID(f, 'AdobeScriptAutomation Scripts'); // ID
  writeByteString(f, 'Scripts'); // Dictionary
  writeLong(f, -1); // Descriptor
  writeDescriptor(f);
}

writeAction = function(f)
{
  writeShort(f, 0); // Function key
  writeBoolean(f, 0); // Shift
  writeBoolean(f, 0); // Command
  writeShort(f, 0); // Color
  writeUnicodeString(f, 'First Action'); // Name
  writeBoolean(f, 0); // Expanded
  writeLong(f, 1); // Command count
  writeCommand(f);
}

writeActionSet = function(f)
{
  writeUnicodeString(f, 'Somnium'); // set name
  writeBoolean(f, 0); // expanded
  writeLong(f, 1); // action count
  writeAction(f);
}

writeAtn = function(filename)
{
  try {
    var f = new File(filename);
    f.open('w');
    f.encoding = "BINARY";
    writeLong(f, 16); // Version
    writeActionSet(f);
    f.close();
  } catch (e) {
    log(e);
  }
}
