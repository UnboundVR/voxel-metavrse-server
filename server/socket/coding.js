var storage = require('../services/storage');

var gists;
var dirty = false;

function saveGists() {
  if(dirty) {
    storage.saveGists(gists);
    dirty = false;
  }
}

module.exports = function(io) {
  storage.loadGists().then(function(res) {
    gists = res;

    setInterval(saveGists, 1000); // 1s

    io.on('connection', function(socket) { // TODO use different namespace in socket.io
      socket.on('requestGists', function(callback) {
        callback(gists);
      });

      socket.on('codeChanged', function(position, gistId) {
        gists[position] = gistId;
        socket.broadcast.emit('codeChanged', position, gistId);
        dirty = true;
      });

      socket.on('codeRemoved', function(position) {
        delete gists[position];
        socket.broadcast.emit('codeRemoved', position);
        dirty = true;
      });
    });
  });
};
