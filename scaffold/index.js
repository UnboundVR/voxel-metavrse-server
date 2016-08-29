import structure from './structure';
import fixtures from './fixtures';
import r from 'rethinkdb';
import dotenv from 'dotenv';

function connect() {
  return r.connect({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    db: process.env.DATABASE
  });
}

async function scaffold() {
  try {
    dotenv.load();
    let conn = await connect();
    await structure(conn);
    let ownerUsername = process.env.ADMIN_USER_ID;
    await fixtures(conn, ownerUsername);

    console.log('Successfuly created and populated db');
  } catch(err) {
    console.error('Error scaffolding db', err);
  }

  process.exit();
}

scaffold();
