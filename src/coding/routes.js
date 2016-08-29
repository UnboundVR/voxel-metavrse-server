import restifyRouter from 'restify-router';
import controller from './controller';

export default {
  init(server) {
    var router = new restifyRouter.Router();

    router.get('/:id/:revision', async (req, res) => {
      try {
        let result = await controller.getGist(req.header('Authorization'), req.params.id, req.params.revision);
        res.json(result);
      } catch(err) {
        console.log('Error getting revision', err);
        res.send(500, err);
      }
    });

    router.post('/', async (req, res) => {
      try {
        let body = JSON.parse(req.body);
        let result = await controller.createGist(req.header('Authorization'), body.code);
        res.json(result);
      } catch(err) {
        console.log('Error creating gist', err);
        res.send(500, err);
      }
    });

    router.post('/:id', async (req, res) => {
      try {
        let body = JSON.parse(req.body);
        let result = await controller.forkOrCreateGist(req.header('Authorization'), req.params.id, body.code);
        res.json(result);
      } catch(err) {
        console.log('Error forking gist', err);
        res.send(500, err);
      }
    });

    router.put('/:id', async (req, res) => {
      try {
        let body = JSON.parse(req.body);
        let result = await controller.updateGist(req.header('Authorization'), req.params.id, body.code);
        res.json(result);
      } catch(err) {
        console.log('Error updating gist', err);
        res.send(500, err);
      }
    });

    router.applyRoutes(server, '/coding');
  }
};
