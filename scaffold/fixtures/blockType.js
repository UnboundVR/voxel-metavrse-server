import r from 'rethinkdb';
import blockTypes from '../data/blockTypes.json';

export default async function(conn, ownerUserId) {
  for(let item of blockTypes) {
    item.owner = {
      id: ownerUserId,
      name: 'generated_from_scaffold'
    };
    await r.db('metavrse').table('blockType').insert(item).run(conn);
  }
  console.log(`Loaded ${blockTypes.length} block types into the db owned by ${ownerUserId}`);

  return blockTypes.length;
}
