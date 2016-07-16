import r from 'rethinkdb';

export default {
  getChunks(dbConn) {
    return r.table('chunk').run(dbConn).then(data => data.toArray());
  },
  getMaterials(dbConn) {
    return r.table('material').run(dbConn).then(data => data.toArray());
  },
  saveChunkChange(dbConn, chunkPos, pos, val) {
    function getFlatLocalCoord() {
      return 0;
    }

    return r.table('chunk').filter({position: chunkPos}).update({
      voxels: r.row('voxels').changeAt(getFlatLocalCoord(), val)
    }).run(dbConn);
  }
};
