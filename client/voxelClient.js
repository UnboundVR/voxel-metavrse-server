var rle = require('../shared/rle');
var engine = require('voxel-engine');
var io = require('socket.io-client');

module.exports = {
  init: function() {
    var self = this;
    this.connect();
    return new Promise(function(resolve, reject) {
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
      chunk.voxels = rle.decode(chunk.voxels);
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
