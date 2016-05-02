import controller from './controller';
import routes from './routes';
import voxelEngine from './voxelEngine';

export default {
  init(io, dbConn) {
    return controller.init(dbConn).then((loadedChunksAmount) => {
      console.log(`loaded ${loadedChunksAmount} chunks from DB`);
      return routes.init(io, dbConn);
    });

    // setInterval(function() {
    //   controller.saveChunks().catch(function(err) {
    //     console.log('Error auto saving chunks', err);
    //   });
    // }, consts.voxel.AUTO_SAVE_INTERVAL);
  },
  getChunkSeedData() {
    voxelEngine.init();
    return voxelEngine.getAllChunks();
  }
};
