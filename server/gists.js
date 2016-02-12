var gists = {};

module.exports = function(io) {
  io.on('connection', function(socket) { // TODO use different namespace in socket.io
    socket.on('gimmeGists', function(callback) {
      callback(gists);
    });

    socket.on('codeChanged', function(position, gistId) {
      gists[position] = gistId;
      socket.broadcast.emit('codeChanged', position, gistId);
    });

    socket.on('codeRemoved', function(position) {
      delete gists[position];
      socket.broadcast.emit('codeRemoved', position);
    });
  });
};
