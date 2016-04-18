import r from 'rethinkdb';

let connection = r.connect({
  host: 'localhost',
  port: 28015,
  db: 'metavrse'
});

export default {
  init() {
    return connection;
  }
};
