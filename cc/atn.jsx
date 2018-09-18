//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Atn file handling
//
//**************************************************************************

writeBytes = function(f, number, bytes)
{
  var array = [];
  for (var i = bytes - 1; i >= 0; --i) {
    array[i] = number & 255;
    number = number >> 8;
  }
  for (var i = 0; i < bytes; ++i) {
    f.write(String.fromCharCode(array[i]));
  }
}

writeLong = function(f, number)
{
  writeBytes(f, number, 4);
}

writeShort = function(f, number)
{
  writeBytes(f, number, 2);
}

writeBoolean = function(f, number)
{
  writeBytes(f, number, 1);
}

writeByte = function(f, number)
{
  writeBytes(f, number, 1);
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

writePair = function(f, type, data)
{
  write4ByteID(f, type);
  if (type == 'TEXT') {
    writeUnicodeString(f, data);
  } else if (type == 'alis') {
    writeLong(f, 0);
    //f.write(String.fromCharCode(array[i]));
  }
}

writeDescriptor = function(f)
{
  data = [];
  writeClass(f);
  writeLong(f, 2); // Items
  writeCharID(f, 'jsCt');
  writePair(f, 'alis', data);
  writeCharID(f, 'jsMs');
  writePair(f, 'TEXT', 'undefined');
}

writeCommand = function(f)
{
  writeBoolean(f, 0); // Expanded
  writeBoolean(f, 0); // Enabled
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
    //log(e);
    alert(e.message);
  }
}
