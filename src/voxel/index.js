import controller from './controller';
import routes from './routes';

export default {
  init(io, dbConn) {
    return controller.init(dbConn).then((loadedChunksAmount) => {
      console.log(`Loaded ${loadedChunksAmount} chunks from DB`);

      return routes.init(io, dbConn);
    });
  }
};
