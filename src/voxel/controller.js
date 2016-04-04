var engine = require('./voxelEngine');
var itemTypes = require('./itemTypes.json');
var blockTypes = require('./blockTypes.json');
var materials = require('./materials.json');
var compression = require('./compression');

module.exports = {
  init: function() {
    engine.init();
  },
  initClient: function() {
    return {
      settings: engine.getSettings(),
      chunks: engine.getInitialChunks(),
      materials: materials,
      itemTypes: itemTypes,
      blockTypes: blockTypes
    };
  },
  requestChunk: function(chunkPos) {
    engine.ensureChunkExists(chunkPos);

    var chunk = engine.getChunk(chunkPos);
    return compression.compress(chunk);
  },
  set: function(pos, val, broadcast) {
    engine.setBlock(pos, val);

    var chunkPos = engine.chunkAtPosition(pos);
    compression.invalidateCache(chunkPos);

    broadcast(pos, val);
  }
};
