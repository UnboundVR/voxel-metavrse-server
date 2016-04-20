import Promise from 'bluebird';
import r from 'rethinkdb';

export default {
  getEmptyChunkTable(dbConn) {
    return new Promise((resolve, reject) => {
      r.table('chunk').isEmpty().run(dbConn, (error, data) => {
        resolve(data);
      });
    });
  },
  saveChunks(dbConn, chunks) {
    return new Promise((resolve, reject) => {
      r.table('chunk').insert(chunks).run(dbConn, (error, data) => {
        if (error) reject(error);
        resolve(data);
      });
    });
  },
  getChunks(dbConn) {
    return new Promise((resolve, reject) => {
      r.table('chunk').run(dbConn, (error, data) => {
        if (error) reject(error);
        resolve(data.toArray());
      });
    });
  }
};
