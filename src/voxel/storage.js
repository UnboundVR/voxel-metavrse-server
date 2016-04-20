import r from 'rethinkdb';

export default {
  isChunkTableEmpty(dbConn) {
    return r.table('chunk').isEmpty().run(dbConn);
  },
  saveChunks(dbConn, chunks) {
    return r.table('chunk').insert(chunks).run(dbConn);
  },
  getChunks(dbConn) {
    return r.table('chunk').run(dbConn).then(data => data.toArray());
  }
};
