import controller from './controller';
import routes from './routes';

export default function(io, dbConn) {
  return controller.init(dbConn).then(() => routes.init(io));

  // setInterval(function() {
  //   controller.saveChunks().catch(function(err) {
  //     console.log('Error auto saving chunks', err);
  //   });
  // }, consts.voxel.AUTO_SAVE_INTERVAL);
}
