#include "../cc/main.jsx"
init((new File($.fileName)).parent + '/../');

var key = NaN;
var conn = new Socket;

if (conn.open("127.0.0.1:7563")) {
    conn.write("GET\n");
    key = parseInt(conn.read(999999));
    conn.close();
}

switch(key) {
  case 0:
    alert('First key');
    break;
  case isNaN(key):
    alert('Invalid key from the macro keyboard.');
    break;
  default:
    alert('No handler for this key: ' + key);
}
