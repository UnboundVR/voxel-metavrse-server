import r from 'rethinkdb';

let connection = r.connect({
  host: 'localhost',
  port: 28015
});

//FIXME: this is ugly
connection
  .then(function(conn) {
    r.dbDrop('metavrse').run(conn, function(error, a) {
      r.dbCreate('metavrse').run(conn, function(error, data) {
        r.db('metavrse').tableCreate('chunk').run(conn, function(error, databis) {
          process.exit();
        });
      });
    });
  });
