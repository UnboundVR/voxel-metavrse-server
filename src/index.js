import r from 'rethinkdb';
import restify from 'restify';
import socketio from 'socket.io';

let server = restify.createServer();
server.use(restify.CORS());

let io = socketio.listen(server.server);

// r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
//   if(err) throw err;
//   r.db('test').tableCreate('tv_shows').run(conn, function(err, res) {
//     if(err) throw err;
//     console.log(res);
//     r.table('tv_shows').insert({ name: 'Star Trek TNG' }).run(conn, function(err, res)
//     {
//       if(err) throw err;
//       console.log(res);
//     });
//   });
// });

// require('use-strict'); // TODO: uncomment after fixing strict issues with libraries
require('dotenv').load();

import dotenv from 'dotenv';
dotenv.load();

import voxel from './voxel';
import playerSync from './playerSync';
import coding from './coding';
import chat from './chat';
import auth from './auth';

voxel(io);
playerSync(io);
coding(io);
chat(io);
auth(server);

// Run the server
let port = process.env.PORT;
server.listen(port, function() {
  console.log('Listening at port ' + port + '!');
});
