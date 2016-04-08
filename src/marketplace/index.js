import restifyRouter from 'restify-router';
import controller from './controller';

export default function(server) {
  var router = new restifyRouter.Router();

  router.get('/init', (req, res) => {
    res.json(controller.initUser());
  });

  router.get('/blockTypes', (req, res) => {
    controller.getBlockTypes(req.header('Authorization'), req.params.ids).then(result => {
      res.json(result);
    });
  });

  router.get('/itemTypes', (req, res) => {
    controller.getItemTypes(req.header('Authorization'), req.params.ids).then(result => {
      res.json(result);
    });
  });

  router.get('/all', (req, res) => {
    res.json(controller.getAll());
  });

  router.post('/blockType', (req, res) => {
    var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
    controller.addBlockType(req.header('Authorization'), body.code, body.material, body.name).then(function(blockType) {
      res.json(blockType);
    });
  });

  router.post('/blockType/:id/fork', (req, res) => {
    var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
    controller.forkBlockType(req.header('Authorization'), req.params.id, body.code, body.material, body.name).then(function(blockType) {
      res.json(blockType);
    });
  });

  router.put('/blockType/:id', (req, res) => {
    var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
    controller.updateBlockType(req.header('Authorization'), req.params.id, body.code).then(function(blockType) {
      res.json(blockType);
    });
  });

  router.applyRoutes(server, '/marketplace');
}
