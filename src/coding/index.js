import routes from './routes';
import controller from './controller';

export default {
  init(server) {
    routes.init(server);
  },
  createGist: controller.createGist.bind(controller),
  updateGist: controller.updateGist.bind(controller),
  forkOrCreateGist: controller.forkOrCreateGist.bind(controller)
};
