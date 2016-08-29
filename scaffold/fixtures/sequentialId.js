import r from 'rethinkdb';

export default async function(conn, numbers) {
  await r.table('sequentialId').insert({
    id: 'material',
    number: numbers.material
  }).run(conn);

  await r.table('sequentialId').insert({
    id: 'itemType',
    number: numbers.item
  }).run(conn);

  await r.table('sequentialId').insert({
    id: 'blockType',
    number: numbers.block
  }).run(conn);

  console.log('Initialized all sequential IDs');
}
