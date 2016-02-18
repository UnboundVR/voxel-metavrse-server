module.exports = {
  saveChunk: function(chunkId, chunk) {
    console.log('saving ' + chunkId)
  },
  loadChunk: function(chunkId) {
    console.log('loading ' + chunkId)
    return null;
  }
};
