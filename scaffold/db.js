import r from 'rethinkdb';

let connection = r.connect({
  host: 'localhost',
  port: 28015
});

//FIXME: this is ugly
connection
  .then(function(conn) {
    r.dbDrop('metavrse').run(conn, function() {
      r.dbCreate('metavrse').run(conn, function() {
        r.db('metavrse').tableCreate('chunk').run(conn, function() {
          console.log('success');
          process.exit();
        });
      });
    });
  });
