import restifyRouter from 'restify-router';
import controller from './controller';

export default {
  init(server, dbConn) {
    var router = new restifyRouter.Router();

    router.get('/toolbar', async (req, res) => {
      try {
        let toolbar = await controller.getToolbar(dbConn, req.header('Authorization'));
        res.json(toolbar);
      } catch(err) {
        console.log('Error getting toolbar', err);
        res.send(500, err);
      }
    });

    router.del('/toolbar/:position', async (req, res) => {
      try {
        await controller.removeToolbarItem(dbConn, req.header('Authorization'), req.params.position);
        res.json({});
      } catch(err) {
        console.log(`Error removing toolbar item at position ${req.params.position}`, err);
        res.send(500, err);
      }
    });

    router.put('/toolbar/:position', async (req, res) => {
      try {
        let body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
        await controller.setToolbarItem(dbConn, req.header('Authorization'), req.params.position, body.type, body.id);
        res.json({});
      } catch(err) {
        console.log(`Error setting toolbar item at position ${req.params.position}`, err);
        res.send(500, err);
      }
    });

    router.get('/blockTypes', async (req, res) => {
      try {
        let blockTypes = await controller.getBlockTypes(dbConn, req.header('Authorization'), req.params.ids.split(',').map(id => parseInt(id)));
        res.json(blockTypes);
      } catch(err) {
        console.log('Error getting block types', err);
        res.send(500, err);
      }
    });

    router.get('/itemTypes', async (req, res) => {
      try {
        let itemTypes = await controller.getItemTypes(dbConn, req.header('Authorization'), req.params.ids.split(',').map(id => parseInt(id)));
        res.json(itemTypes);
      } catch(err) {
        console.log('Error getting item types', err);
        res.send(500, err);
      }
    });

    router.get('/all', async (req, res) => {
      try {
        let data = await controller.getAll(dbConn);
        res.json(data);
      } catch(err) {
        console.log('Error getting items and blocks', err);
        res.send(500, err);
      }
    });

    router.patch('/blockType/:id', async (req, res) => {
      try {
        let body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
        let blockType = await controller.updateBlockCode(dbConn, req.header('Authorization'), parseInt(req.params.id), body.code);
        res.json(blockType);
      } catch(err) {
        console.log('Error updating block code', err);
        res.send(500, err);
      }
    });

    router.patch('/itemType/:id', async (req, res) => {
      try {
        let body = JSON.parse(req.body); // TODO automatically send the stuff parsed...
        let blockType = await controller.updateItemCode(dbConn, req.header('Authorization'), parseInt(req.params.id), body.code);
        res.json(blockType);
      } catch(err) {
        console.log('Error updating item code', err);
        res.send(500, err);
      }
    });

    router.post('/blockType', async (req, res) => {
      try {
        let body = JSON.parse(req.body); // TODO automatically send the stuff parsed...

        let props = {
          name: body.name,
          material: body.material
        };

        let blockType = await controller.addBlockType(dbConn, req.header('Authorization'), body.code, props);
        res.json(blockType);
      } catch(err) {
        console.log('Error creating block', err);
        res.send(500, err);
      }
    });

    router.post('/itemType', async (req, res) => {
      try {
        let body = JSON.parse(req.body); // TODO automatically send the stuff parsed...

        let props = {
          name: body.name,
          adjacentActive: body.adjacentActive,
          crosshairIcon: body.crosshairIcon
        };

        let itemType = await controller.addItemType(dbConn, req.header('Authorization'), body.code, props);
        res.json(itemType);
      } catch(err) {
        console.log('Error creating item', err);
        res.send(500, err);
      }
    });

    router.applyRoutes(server, '/inventory');
  }
};
