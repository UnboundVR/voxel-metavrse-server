var restify = require('restify');
var server = restify.createServer();

var io = require('socket.io')(server);

server.use(restify.CORS());

// require('use-strict'); // TODO: uncomment after fixing strict issues with libraries
require('dotenv').load();

require('./voxel')(io);
require('./playerSync')(io);
require('./coding')(io);
require('./chat')(io);
require('./auth')(server);

// Run the server
var port = process.env.PORT;
server.listen(port, function() {
  console.log('Listening at port ' + port + '!');
});
