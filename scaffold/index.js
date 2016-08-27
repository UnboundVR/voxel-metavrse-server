import structure from './structure';
import fixtures from './fixtures';
import r from 'rethinkdb';

function connect() {
  return r.connect({ // TODO place db config in .env (& update .env.template)
    host: 'localhost',
    port: 28015
  });
}

async function scaffold() {
  try {
    let conn = await connect();
    await structure(conn);
    let ownerUserId = parseInt(process.argv[2]) || 0;
    await fixtures(conn, ownerUserId); // TODO at this point we should select the metavrse db (the name should come from .env)

    console.log('Successfuly created and populated db');
  } catch(err) {
    console.error('Error scaffolding db', err);
  }

  process.exit();
}

scaffold();
