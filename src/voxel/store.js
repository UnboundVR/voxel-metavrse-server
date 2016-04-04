import fileStorage from '../fileStorage';

module.exports = {
  saveChunk(chunkId, chunk) {
    return fileStorage('chunks').save(chunkId, chunk);
  },
  loadChunk(chunkId) {
    return fileStorage('chunks').load(chunkId);
  }
};
