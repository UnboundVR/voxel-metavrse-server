import voxel from '../../src/voxel';
import r from 'rethinkdb';

export default async function(conn) {
  let chunks = voxel.getChunkSeedData();
  for (let chunk of chunks) {
    chunk.id = chunk.position.join('|');
  }

  await r.db('metavrse').table('chunk').insert(chunks).run(conn);
  console.log(`Loaded ${chunks.length} chunks into the db`);
}
