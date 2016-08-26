import controller from './controller';
import routes from './routes';
import voxelEngine from './voxelEngine';

export default {
  init(io, dbConn) {
    return controller.init(dbConn).then((loadedChunksAmount) => {
      console.log(`Loaded ${loadedChunksAmount} chunks from DB`);

      return routes.init(io, dbConn);
    });
  },
  getChunkSeedData() {
    voxelEngine.init();
    return voxelEngine.getAllChunks();
  }
};
