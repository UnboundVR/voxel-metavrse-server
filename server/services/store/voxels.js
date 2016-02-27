var fileStorage = require('./fileStorage');

module.exports = {
  saveChunk: function(chunkId, chunk) {
    return fileStorage.save('chunks/' + chunkId, chunk);
  },
  loadChunk: function(chunkId) {
    return fileStorage.load('chunks/' + chunkId);
  }
};
