module.exports = {
  compress: function(chunk) {
    return chunk; // 100% lossless & performant compression. The only downside: it doesn't compress it. // TODO implement
  },
  invalidateCache: function(chunkPosition) {
    // TODO implement
  }
};
