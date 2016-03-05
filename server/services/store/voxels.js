var fileStorage = require('./fileStorage')('chunks');

module.exports = {
  saveChunk: function(chunkId, chunk) {
    return fileStorage.save(chunkId, chunk);
  },
  loadChunk: function(chunkId) {
    return fileStorage.load(chunkId);
  }
};
