import restifyRouter from 'restify-router';
import controller from './controller';

export default function(server) {
  var router = new restifyRouter.Router();

  router.get('/init', (req, res) => {
    res.json(controller.initUser());
  });

  router.get('/blockTypes', (req, res) => {
    controller.getBlockTypes(req.params.token, req.params.ids).then(result => {
      res.json(result);
    });
  });

  router.get('/itemTypes', (req, res) => {
    controller.getItemTypes(req.params.token, req.params.ids).then(result => {
      res.json(result);
    });
  });

  router.get('/all', (req, res) => {
    res.json(controller.getAll());
  });

  router.post('/blockType', (req, res) => {
    var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
    controller.addBlockType(req.params.token, body.code, body.material, body.name).then(function(blockType) {
      res.json(blockType);
    });
  });

  router.applyRoutes(server, '/marketplace');
}
