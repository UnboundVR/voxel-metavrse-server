import r from 'rethinkdb';
import defaultToolbar from '../data/defaultToolbar.json';

export default async function(conn, userId) {
  await r.table('toolbar').insert({
    id: userId,
    items: defaultToolbar
  }).run(conn);
  console.log(`Loaded default data into toolbar for user ${userId}`);
}
