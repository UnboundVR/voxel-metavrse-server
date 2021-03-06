import restify from 'restify';
import socketio from 'socket.io';
import db from './db';

let server = restify.createServer();

restify.CORS.ALLOW_HEADERS.push('authorization');
server.use(restify.CORS());

server.use(restify.queryParser());
server.use(restify.bodyParser());

let io = socketio.listen(server.server);

// require('use-strict'); // TODO: uncomment after fixing strict issues with libraries

import dotenv from 'dotenv';
dotenv.load();

import voxel from './voxel';
import playerSync from './playerSync';
import chat from './chat';
import auth from './auth';
import inventory from './inventory';
import coding from './coding';

db.init().then(function(dbConn) {
  return Promise.all([
    voxel.init(io, server, dbConn),
    playerSync(io),
    chat(io),
    auth.init(server),
    coding.init(server),
    inventory(server, dbConn)
  ]);
}).then(() => {
  // Run the server
  let port = process.env.PORT || 1338;
  server.listen(port, () => {
    console.log('Listening at port ' + port + '!');
  });
});
