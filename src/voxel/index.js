import controller from './controller';
import routes from './routes';

export default {
  init(io, server, dbConn) {
    return controller.init(dbConn).then((loadedChunksAmount) => {
      console.log(`Loaded ${loadedChunksAmount} chunks from DB`);

      return routes.init(io, server, dbConn);
    });
  }
};
