import r from 'rethinkdb';

export default {
  init() {
    let connection = r.connect({
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      db: process.env.DATABASE
    });
    return connection;
  }
};
