import structure from './structure';
import fixtures from './fixtures';
import r from 'rethinkdb';
import dotenv from 'dotenv';

function connect() {
  return r.connect({ // TODO place db config in .env (& update .env.template)
    host: 'localhost',
    port: 28015
  });
}

async function scaffold() {
  try {
    dotenv.load();
    let conn = await connect();
    await structure(conn);
    let ownerUsername = process.env.ADMIN_USER_ID;
    await fixtures(conn, ownerUsername); // TODO at this point we should select the metavrse db (the name should come from .env)

    console.log('Successfuly created and populated db');
  } catch(err) {
    console.error('Error scaffolding db', err);
  }

  process.exit();
}

scaffold();
