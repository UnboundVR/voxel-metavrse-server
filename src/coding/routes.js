import restifyRouter from 'restify-router';
import controller from './controller';

export default {
  init(server) {
    var router = new restifyRouter.Router();

    router.get('/:id/:revision', (req, res) => {
      controller.getGist(req.header('Authorization'), req.params.id, req.params.revision).then(result => {
        res.json(result);
      });
    });

    router.applyRoutes(server, '/coding');
  }
};
