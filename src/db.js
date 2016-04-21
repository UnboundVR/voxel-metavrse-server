import r from 'rethinkdb';

let connection = r.connect({ // TODO place db config in .env (& update .env.template)
  host: 'localhost',
  port: 28015,
  db: 'metavrse' // TODO place db name in .env
});

export default {
  init() {
    return connection;
  }
};
