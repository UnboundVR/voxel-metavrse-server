import r from 'rethinkdb';

async function getNextId(dbConn, name) {
  let result = await r.table('sequentialId').get('blockType').update({number: r.row('number').add(1)}, {return_vals: true});
  return result.new_val.number;
}

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
  async addBlockType(dbConn, item) {
    let id = await getNextId(dbConn, 'blockType');
    item.id = id;

    return r.table('blockType').insert(item).run(dbConn);
  },
  updateBlockType(dbConn, item) {
    return r.table('blockType').replace(item).run(dbConn);
  },
  async addItemType(dbConn, item) {
    let id = await getNextId(dbConn, 'blockType');
    item.id = id;

    return r.table('itemType').insert(item).run(dbConn);
  },
  updateItemType(dbConn, item) {
    return r.table('blockType').replace(item).run(dbConn);
  }
};
