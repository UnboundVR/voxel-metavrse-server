var gists = {};

module.exports = function(io) {
  io.on('connection', function(socket) { // TODO use different namespace in socket.io
    socket.emit('allGists', gists);

    socket.on('codeChanged', function(position, gistId) {
      gists[position] = gistId;
      io.sockets.emit('codeChanged', position, gistId);
    });
  });
};
