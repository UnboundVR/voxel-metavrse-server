import engine from 'voxel-engine';
import io from 'socket.io-client';

function decompress(chunk) { // FIXME repeated
  var voxels = new Array(chunk.dims[0] * chunk.dims[1] * chunk.dims[2]).fill(0);
  chunk.voxels.forEach(function(obj) {
    voxels[obj.i] = obj.v;
  });
  return voxels;
}

export default {
  init: function() {
    var self = this;
    this.connect();
    return new Promise(function(resolve) {
      self.onReady = resolve;
    });
  },
  connect: function() {
    this.socket = io.connect(location.host + '/voxel');
    this.socket.on('disconnect', function() {
      // TODO handle disconnection
    });
    this.bindEvents();
  },
  bindEvents: function() {
    var self = this;

    var processChunk = function(chunk) {
      chunk.voxels = decompress(chunk);
      self.engine.showChunk(chunk);
    };

    this.socket.on('init', function(data) {
      var settings = data.settings;
      var chunks = data.chunks;
      settings.generateChunks = false;
      self.engine = self.createEngine(settings);
      chunks.forEach(processChunk);

      self.engine.voxels.on('missingChunk', function(chunkPosition) {
        self.socket.emit('requestChunk', chunkPosition, function(err, chunk) {
          if(err) {
            alert('Error getting chunk: ', err);
          } else {
            processChunk(chunk);
          }
        });
      });

      self.onReady();
    });

    this.socket.on('set', function(pos, val) {
      self.engine.setBlock(pos, val);
    });
  },
  createEngine: function(settings) {
    var self = this;
    settings.controlsDisabled = false;
    self.engine = engine(settings);
    self.engine.settings = settings;

    return self.engine;
  },
  setBlock: function(position, type) {
    this.socket.emit('set', position, type);
  },
  clearBlock: function(position) {
    this.setBlock(position, 0);
  }
};
