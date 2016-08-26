import r from 'rethinkdb';
import itemTypes from '../data/itemTypes.json';

export default async function(conn) {
  for(let item of itemTypes) {
    item.owner = 0;
    await r.db('metavrse').table('itemType').insert(item).run(conn);
  }
  console.log(`Loaded ${itemTypes.length} item types into the db`);

  return itemTypes.length;
}
