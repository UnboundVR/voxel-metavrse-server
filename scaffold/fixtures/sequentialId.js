import r from 'rethinkdb';

export default async function(conn) {
  await r.db('metavrse').table('sequentialId').insert({
    id: 'material',
    number: 1
  }).run(conn);

  await r.db('metavrse').table('sequentialId').insert({
    id: 'itemType',
    number: 1
  }).run(conn);

  await r.db('metavrse').table('sequentialId').insert({
    id: 'blockType',
    number: 1
  }).run(conn);

  console.log('Initialized all sequential IDs to to 1');
}
