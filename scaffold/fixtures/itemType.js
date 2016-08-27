import r from 'rethinkdb';
import itemTypes from '../data/itemTypes.json';

export default async function(conn, ownerUserId) {
  for(let item of itemTypes) {
    item.owner = {
      id: ownerUserId,
      name: 'generated_from_scaffold'
    };
    await r.db('metavrse').table('itemType').insert(item).run(conn);
  }
  console.log(`Loaded ${itemTypes.length} item types into the db owned by ${ownerUserId}`);

  return itemTypes.length;
}
