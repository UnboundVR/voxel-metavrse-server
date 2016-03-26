var Promise = require('promise');
// var storage = require('./store');
var settings = require('../../shared/voxelSettings.json');

var chunks = [];

module.exports = {
  init: function() {

  },
  initClient: function() {
    return Promise.resolve({
      chunks: []
    });
  },
  requestChunk: function(chunkPosition) {

  },
  set: function(pos, val, broadcast) {

  }
};
