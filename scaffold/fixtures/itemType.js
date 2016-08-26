import r from 'rethinkdb';
import itemTypes from '../data/itemTypes.json';

export default async function(conn, ownerUserId) {
  for(let item of itemTypes) {
    item.owner = ownerUserId;
    await r.db('metavrse').table('itemType').insert(item).run(conn);
  }
  console.log(`Loaded ${itemTypes.length} item types into the db`);

  return itemTypes.length;
}
