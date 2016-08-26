import r from 'rethinkdb';

export default {
  getAllItemTypes(dbConn) {
    return r.table('itemType').run(dbConn).then(data => data.toArray());
  },
  getAllBlockTypes(dbConn) {
    return r.table('blockType').run(dbConn).then(data => data.toArray());
  },
  getBlockTypes() {
    throw new Error('not implemented');
  },
  getItemTypes() {
    throw new Error('not implemented');

  },
  getBlockType() {
    throw new Error('not implemented');

  },
  getItemType() {
    throw new Error('not implemented');

  },
  addBlockType() {
    // TODO increment sequential id, then do the magic
    throw new Error('not implemented');
  },
  updateBlockType() {
    throw new Error('not implemented');
  },
  addItemType() {
    // TODO increment sequential id, then do the magic
    throw new Error('not implemented');
  },
  updateItemType() {
    throw new Error('not implemented');
  }
};
