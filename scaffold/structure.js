import r from 'rethinkdb';

export default async function createStructure(conn) {
  try {
    await r.dbDrop('metavrse').run(conn);
    console.log('Dropped db');
  } catch (e) {
    console.log('Database does not exist, creating...');
  }

  await r.dbCreate('metavrse').run(conn);
  console.log('Created db');

  await r.db('metavrse').tableCreate('chunk').run(conn);
  console.log('Created chunk table');

  await r.db('metavrse').tableCreate('material').run(conn);
  console.log('Created materials table');

  await r.db('metavrse').tableCreate('blockType').run(conn);
  console.log('Created blockType table');

  await r.db('metavrse').tableCreate('itemType').run(conn);
  console.log('Created itemType table');

  await r.db('metavrse').tableCreate('sequentialId').run(conn);
  console.log('Created sequentialIds table');
}
