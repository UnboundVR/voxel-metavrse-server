import restify from 'restify';
import socketio from 'socket.io';

let server = restify.createServer();
server.use(restify.CORS());
server.use(restify.queryParser());
server.use(restify.bodyParser());

let io = socketio.listen(server.server);

// require('use-strict'); // TODO: uncomment after fixing strict issues with libraries
require('dotenv').load();

import dotenv from 'dotenv';
dotenv.load();

import voxel from './voxel';
import playerSync from './playerSync';
import chat from './chat';
import auth from './auth';
import marketplace from './marketplace';

voxel(io);
playerSync(io);
chat(io);
auth(server);
marketplace(server);

// Run the server
let port = process.env.PORT;
server.listen(port, function() {
  console.log('Listening at port ' + port + '!');
});
