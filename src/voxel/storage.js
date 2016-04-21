import r from 'rethinkdb';

export default {
  getChunks(dbConn) {
    return r.table('chunk').run(dbConn).then(data => data.toArray());
  }
};
