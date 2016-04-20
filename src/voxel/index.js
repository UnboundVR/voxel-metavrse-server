import constants from '../constants';
import controller from './controller';
import routes from './routes';
import events from '../events';

export default function(io, dbConn) {
  routes.init(io);
  controller.init(dbConn).then(() => {
    //events.emit(constants.SERVER_INITIALIZED, 'blas');
  });

  // setInterval(function() {
  //   controller.saveChunks().catch(function(err) {
  //     console.log('Error auto saving chunks', err);
  //   });
  // }, consts.voxel.AUTO_SAVE_INTERVAL);
}
