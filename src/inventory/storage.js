import r from 'rethinkdb';

async function getNextId(dbConn, name) {
  let result = await r.table('sequentialId').get(name).update({number: r.row('number').add(1)}, {return_changes: true}).run(dbConn);
  return result.changes[0].old_val.number;
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
    let id = await getNextId(dbConn, 'itemType');
    item.id = id;

    return r.table('itemType').insert(item).run(dbConn);
  },
  updateItemType(dbConn, item) {
    return r.table('itemType').replace(item).run(dbConn);
  },
  async getToolbar(dbConn, userId) {
    let toolbar = await r.table('toolbar').get(userId).run(dbConn);

    if(!toolbar) {
      toolbar = {id: userId, items: [null, null, null, null, null, null, null, null, null]};
      await r.table('toolbar').insert(toolbar).run(dbConn);
    }

    return toolbar.items;
  },
  updateToolbarItem(dbConn, userId, position, value) {
    return r.table('toolbar').filter({id: userId}).update({
      items: r.row('items').changeAt(position, value)
    }).run(dbConn);
  }
};
