import restifyRouter from 'restify-router';
import itemTypes from './itemTypes.json';
import blockTypes from './blockTypes.json';
import materials from './materials.json';
import Promise from 'promise';
import extend from 'extend';
import github from './github';

export default function(server) {
  var router = new restifyRouter.Router();

  function resolve(token, code) {
    if(token) {
      return github.getGist(code, token);
    } else {
      return Promise.resolve(code);
    }
  }

  function resolveBlockTypes(token) {
    let promises = blockTypes.map(blockType => {
      if(blockType.code) {
        return resolve(token, blockType.code).then(codeObj => {
          let res = extend({}, blockType);
          res.code = codeObj;
          return res;
        });
      } else {
        return blockType;
      }
    });

    return Promise.all(promises);
  }

  router.get('/init', (req, res) => {
    resolveBlockTypes(req.params.token).then(resolvedBlockTypes => {
      res.json({
        materials,
        itemTypes,
        blockTypes: resolvedBlockTypes
      });
    });
  });

  router.applyRoutes(server, '/marketplace');
}
