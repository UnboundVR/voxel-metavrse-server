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

    router.post('/', (req, res) => {
      var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
      controller.createGist(req.header('Authorization'), body.code).then(function(blockType) {
        res.json(blockType);
      });
    });

    router.post('/:id', (req, res) => {
      var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
      controller.forkOrCreateGist(req.header('Authorization'), req.params.id, body.code).then(function(blockType) {
        res.json(blockType);
      });
    });

    router.put('/:id', (req, res) => {
      var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
      controller.updateGist(req.header('Authorization'), req.params.id, body.code).then(function(blockType) {
        res.json(blockType);
      });
    });

    router.applyRoutes(server, '/coding');
  }
};
