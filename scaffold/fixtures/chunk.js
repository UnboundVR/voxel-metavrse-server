import voxel from '../../src/voxel';
import r from 'rethinkdb';

export default async function(conn) {
  let chunks = voxel.getChunkSeedData();

  await r.db('metavrse').table('chunk').insert(chunks).run(conn);
  console.log(`loaded ${chunks.length} chunks into the db`);
}
