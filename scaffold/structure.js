import r from 'rethinkdb';

export default async function createStructure(conn) {
  try {
    await r.dbDrop('metavrse').run(conn);
    console.log('dropped db');
  } catch (e) {
    console.log(`Database doesn't exist, we'll create it`);
  }

  await r.dbCreate('metavrse').run(conn);
  console.log('created db');

  await r.db('metavrse').tableCreate('chunk').run(conn);
  console.log('created chunk table');
}
