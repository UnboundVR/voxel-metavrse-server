import r from 'rethinkdb';

export default {
  getChunks(dbConn) {
    return r.table('chunk').run(dbConn).then(data => data.toArray());
  },
  getMaterials(dbConn) {
    return r.table('material').run(dbConn).then(data => data.toArray());
  },
  saveChunkChange(dbConn, chunkPos, chunkDims, pos, val) {
    function getFlatLocalCoord() { // FIXME this only works for cubic chunks (i.e. all dims are the same)
      let d = chunkDims[0];
      let localCoords = [
        pos[0] - chunkPos[0] * d,
        pos[1] - chunkPos[1] * d,
        pos[2] - chunkPos[2] * d
      ];

      let flatLocalPosition = localCoords[0] + localCoords[1] * d + localCoords[2] * d * d;

      // console.log(`Converted ${pos} to ${flatLocalPosition}`);

      return flatLocalPosition;
    }

    return r.table('chunk').filter({position: chunkPos}).update({
      voxels: r.row('voxels').changeAt(getFlatLocalCoord(), val)
    }).run(dbConn);
  }
};
