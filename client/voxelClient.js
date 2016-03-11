// var rle = require('../shared/rle');
var engine = require('voxel-engine');

function decompress(chunk) { // FIXME repeated
  var voxels = new Array(chunk.dims[0] * chunk.dims[1] * chunk.dims[2]).fill(0);
  chunk.voxels.forEach(function(obj) {
    voxels[obj.i] = obj.v;
  });
  return voxels;
}

module.exports = {
  init: function(socket) {
    var self = this;
    this.connect(socket);
    return new Promise(function(resolve, reject) {
      self.onReady = resolve;
    });
  },
  connect: function(socket) {
    var self = this;
    socket.on('disconnect', function() {
      // TODO handle disconnection
    });
    this.socket = socket;
    this.bindEvents(socket);
  },
  bindEvents: function(socket) {
    var self = this;

    var processChunk = function(chunk) {
      chunk.voxels = decompress(chunk);
      self.engine.showChunk(chunk);
    };

    socket.on('init', function(data) {
      var settings = data.settings;
      var chunks = data.chunks;
      settings.generateChunks = false;
      self.engine = self.createEngine(settings);
      chunks.forEach(processChunk);

      self.engine.voxels.on('missingChunk', function(chunkPosition) {
        socket.emit('requestChunk', chunkPosition, function(err, chunk) {
          if(err) {
            alert('Error getting chunk: ', err);
          } else {
            processChunk(chunk);
          }
        });
      });

      self.onReady();
    });

    socket.on('set', function(pos, val) {
      self.engine.setBlock(pos, val);
    });
  },
  createEngine: function(settings) {
    var self = this;
    var socket = this.socket;
    settings.controlsDisabled = false;
    self.engine = engine(settings);
    self.engine.settings = settings;

    return self.engine;
  }
};
