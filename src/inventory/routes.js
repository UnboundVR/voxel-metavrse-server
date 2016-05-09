import restifyRouter from 'restify-router';
import controller from './controller';

export default {
  init(server) {
    var router = new restifyRouter.Router();

    router.get('/toolbar', (req, res) => {
      controller.getToolbar(req.header('Authorization')).then(toolbar => {
        res.json(toolbar);
      });
    });

    router.del('/toolbar/:position', (req, res) => {
      controller.removeToolbarItem(req.header('Authorization'), req.params.position).then(() => {
        res.json({});
      });
    });

    router.put('/toolbar/:position', (req, res) => {
      var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
      controller.setToolbarItem(req.header('Authorization'), req.params.position, body.type, body.id).then(() => {
        res.json({});
      });
    });

    router.get('/blockTypes', (req, res) => {
      res.json(controller.getBlockTypes(req.header('Authorization'), req.params.ids));
    });

    router.get('/itemTypes', (req, res) => {
      res.json(controller.getItemTypes(req.header('Authorization'), req.params.ids));
    });

    router.get('/all', (req, res) => {
      res.json(controller.getAll());
    });

    router.post('/blockType', (req, res) => {
      var body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
      let blockType = controller.addBlockType(req.header('Authorization'), body.code, body.material, body.name);
      res.json(blockType);
    });

    router.applyRoutes(server, '/inventory');
  }
};
