#include "../cc/main.jsx"
init((new File($.fileName)).parent + '/../');

var reply = "";
var conn = new Socket;

if (conn.open("127.0.0.1:7563")) {
    conn.write("GET\n");
    reply = conn.read(999999);
    alert(reply);
    conn.close();
}
