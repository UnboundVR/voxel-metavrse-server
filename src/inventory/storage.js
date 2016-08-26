import r from 'rethinkdb';

export default {
  getAllItemTypes(dbConn) {
    return r.table('itemType').run(dbConn).then(data => data.toArray());
  },
  getAllBlockTypes(dbConn) {
    return r.table('blockType').run(dbConn).then(data => data.toArray());
  },
  getBlockTypes(dbConn, ids) {
    return r.table('blockType').getAll(r.args(ids)).run(dbConn).then(data => data.toArray());
  },
  getItemTypes(dbConn, ids) {
    return r.table('itemType').getAll(r.args(ids)).run(dbConn).then(data => data.toArray());
  },
  getBlockType(dbConn, id) {
    return r.table('blockType').get(id).run(dbConn);
  },
  getItemType(dbConn, id) {
    return r.table('itemType').get(id).run(dbConn);
  },
  addBlockType(dbConn, item) {
    // TODO increment sequential id, then do the magic
    throw new Error('not implemented');
  },
  updateBlockType(dbConn, item) {
    throw new Error('not implemented');
  },
  addItemType(dbConn, item) {
    // TODO increment sequential id, then do the magic
    throw new Error('not implemented');
  },
  updateItemType(dbConn, item) {
    throw new Error('not implemented');
  }
};
