import controller from './controller';
import routes from './routes';

export default {
  init(server) {
    routes.init(server);
  },
  getUser: controller.getLoggedUser.bind(controller)
};
