import controller from './controller';
import restifyRouter from 'restify-router';

export default {
  init(io, server, dbConn) {
    let router = new restifyRouter.Router();

    router.post('/chunk/:chunkId/owners', async (req, res) => {
      try {
        let body = JSON.parse(req.body);
        await controller.addChunkOwner(req.header('Authorization'), req.params.chunkId, body.newOwnerId);
        res.json({});
      } catch(err) {
        console.log('Error adding chunk owner', err);
        res.send(500, err);
      }
    });

    router.applyRoutes(server, '/voxel');

    io.of('voxel').on('connection', async (socket) => {
      try {
        let data = await controller.initClient(dbConn);
        socket.emit('init', data);
      } catch(err) {
        console.log('Error initializing client', err);
      }

      socket.on('requestChunk', (chunkPosition, callback) => {
        try {
          callback(null, controller.requestChunk(chunkPosition));
        } catch(err) {
          console.log(`Error requesting chunk at ${chunkPosition}`, err);
        }
      });

      socket.on('set', async (token, pos, val) => {
        let broadcast = (pos, val) => {
          socket.broadcast.emit('set', pos, val);
        };

        try {
          await controller.set(token, pos, val, broadcast);
        } catch(err) {
          console.log(`Error setting block of type ${val} at ${pos}`, err);
        }
      });
    });
  }
};
