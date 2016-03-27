var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// require('use-strict'); // uncomment after fixing strict issues with libraries
require('dotenv').load();

require('./voxel')(io);
require('./playerSync')(io);
require('./coding')(io);
require('./chat')(io);
require('./auth')(app);

// Run the server
var port = process.env.PORT;
http.listen(port, function() {
  console.log('Listening at port ' + port + '!');
});
