import r from 'rethinkdb';

export default {
  getChunks(dbConn) {
    return r.table('chunk').run(dbConn).then(data => data.toArray());
  },
  getMaterials(dbConn) {
    return r.table('material').run(dbConn).then(data => data.toArray());
  },
  async saveChunk(dbConn, chunk) {
    await r.table('chunk').insert(chunk).run(dbConn);
  },
  addChunkOwner(dbConn, chunkId, newOwner) {
    return r.table('chunk').get(chunkId).update({
      owners: r.row('owners').append(newOwner)
    }).run(dbConn);
  },
  saveChunkChange(dbConn, change) {
    function getFlatLocalCoord() { // this only works for cubic chunks (i.e. all dims are the same)
      let d = change.chunkDims[0];
      let localCoords = [
        change.pos[0] - change.chunkPos[0] * d,
        change.pos[1] - change.chunkPos[1] * d,
        change.pos[2] - change.chunkPos[2] * d
      ];

      let flatLocalPosition = localCoords[0] + localCoords[1] * d + localCoords[2] * d * d;

      // console.log(`Converted ${pos} to ${flatLocalPosition}`);

      return flatLocalPosition;
    }

    return r.table('chunk').get(change.chunkId).update({
      voxels: r.row('voxels').changeAt(getFlatLocalCoord(), change.val)
    }).run(dbConn);
  }
};
