var Promise = require('promise');
var storage = require('./store');
var settings = require('../../shared/voxelSettings.json');

module.exports = {
  init: function() {
    
  },
  initClient: function() {
    return {
      chunks: []
    };
  },
  requestChunk: function(chunkPosition) {

  },
  set: function(pos, val, broadcast) {

  }
};
