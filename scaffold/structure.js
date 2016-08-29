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

  await r.tableCreate('chunk').run(conn);
  console.log('Created chunk table');

  await r.tableCreate('material').run(conn);
  console.log('Created materials table');

  await r.tableCreate('blockType').run(conn);
  console.log('Created blockType table');

  await r.tableCreate('itemType').run(conn);
  console.log('Created itemType table');

  await r.tableCreate('toolbar').run(conn);
  console.log('Created toolbar table');

  await r.tableCreate('sequentialId').run(conn);
  console.log('Created sequentialIds table');
}
