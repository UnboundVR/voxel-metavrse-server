import r from 'rethinkdb';

export default async function createStructure(conn) {
  await r.dbDrop('metavrse').run(conn);
  console.log('dropped db');

  await r.dbCreate('metavrse').run(conn);
  console.log('created db');

  await r.db('metavrse').tableCreate('chunk').run(conn);
  console.log('created chunk table');
}
