var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./server/')(io);

var port = 8080;
http.listen(port, function() {
    console.log('Listening at port ' + port + '!');
});
