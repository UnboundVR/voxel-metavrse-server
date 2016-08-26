import r from 'rethinkdb';

export default async function(conn) {
  await r.db('metavrse').table('sequentialId').insert({
    name: 'material',
    number: 1
  }).run(conn);

  await r.db('metavrse').table('sequentialId').insert({
    name: 'itemType',
    number: 1
  }).run(conn);

  await r.db('metavrse').table('sequentialId').insert({
    name: 'blockType',
    number: 1
  }).run(conn);

  console.log('Initialized all sequential IDs to to 1');
}
