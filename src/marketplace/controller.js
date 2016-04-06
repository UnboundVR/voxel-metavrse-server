import itemTypes from './itemTypes.json';
import blockTypes from './blockTypes.json';
import materials from './materials.json';
import Promise from 'promise';
import extend from 'extend';
import github from './github';

var lastBlockId = 0;
blockTypes.forEach(blockType => {
  if(blockType.id > lastBlockId) {
    lastBlockId = blockType.id;
  }
});

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

// function getBlockTypeById(id) {
//   let block = null;
//   blockTypes.forEach(type => {
//     if(type.id == id) {
//       block = type;
//     }
//   });
//   return block;
// }

export default {
  initUser(token) {
    return resolveBlockTypes(token).then(resolvedBlockTypes => {
      return {
        materials,
        itemTypes,
        blockTypes: resolvedBlockTypes
      };
    });
  },
  addBlockType(token, code, material) {
    return github.createGist(code, token).then(githubResponse => {
      var newType = {};
      newType.code = githubResponse.id;
      newType.id = ++lastBlockId;
      newType.material = material;
      newType.name = 'coded stuff';
      newType.icon = 'code';
      blockTypes.push(newType);

      return newType;
    });
  }
};
