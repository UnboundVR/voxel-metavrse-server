var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

module.exports = function() {
  // Static stuff
  app.use('/build', express.static('build'));
  app.use('/assets', express.static('assets'));
  app.use('/node_modules', express.static('node_modules'));
  app.get('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/..' });
  });

  // The interesting part :D
  require('./socket')(io);
  require('./api')(app);

  // Run the server
  var port = process.env.PORT;
  http.listen(port, function() {
    console.log('Listening at port ' + port + '!');
  });
};
