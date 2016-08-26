import r from 'rethinkdb';
import blockTypes from '../data/blockTypes.json';

export default async function(conn) {
  for(let item of blockTypes) {
    item.owner = 0;
    await r.db('metavrse').table('blockType').insert(item).run(conn);
  }
  console.log(`Loaded ${blockTypes.length} block types into the db`);
}
