import restifyRouter from 'restify-router';
import controller from './controller';

export default function(server) {
  var router = new restifyRouter.Router();

  router.get('/init', (req, res) => {
    controller.initUser(req.params.token).then(function(result) {
      res.json(result);
    });
  });

  router.post('/blockType', (req, res) => {
    var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
    controller.addBlockType(req.params.token, body.code, body.material).then(function(blockType) {
      res.json(blockType);
    });
  });

  router.applyRoutes(server, '/marketplace');
}
