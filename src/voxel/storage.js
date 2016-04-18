import r from 'rethinkdb';

export default {
  getEmptyChunkTable(dbConn) {
    return new Promise(function(resolve, reject) {
      r.table('chunk').isEmpty().run(dbConn, function(error, data) {
        resolve(data);
      });
    });
  },
  saveChunks(dbConn, chunks) {
    return new Promise(function(resolve, reject) {
      r.table('chunk').insert(chunks).run(dbConn, function(error, data) {
        resolve(data);
      });
    });
  }
};
