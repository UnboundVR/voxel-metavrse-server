import r from 'rethinkdb';
import dotenv from 'dotenv';

dotenv.load();

let connection = r.connect({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  db: process.env.DATABASE
});

export default {
  init() {
    return connection;
  }
};
