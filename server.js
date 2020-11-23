var express = require('express');
var app = express();

app.use(express.static(__dirname + '/Pages')); // 1

var port = 8001;
app.listen(port, function(){
  console.log('Server is running...\nAddress: http://localhost:'+port);
});