import itemTypes from './data/itemTypes.json';
import blockTypes from './data/blockTypes.json';
import defaultToolbar from './data/toolbar.json';
import Promise from 'promise';
import extend from 'extend';
import github from './github';
import auth from '../auth';

const SINGLE_FILENAME = 'single_file';
var toolbars = {};

var lastBlockId = 0;
blockTypes.forEach(blockType => {
  if(blockType.id > lastBlockId) {
    lastBlockId = blockType.id;
  }
});

function resolveCode(token, code) {
  if(token) {
    return github.getGist(code.id, code.revision, token).then(processGist);
  } else {
    return Promise.resolve(code);
  }
}

function resolveTypes(token, types, ids) {
  let promises = types.filter(type => ids.includes(type.id)).map(type => {
    return resolveType(token, type);
  });

  return Promise.all(promises);
}

function resolveType(token, type) {
  if(type.code) {
    return resolveCode(token, type.code).then(codeObj => {
      let resolvedType = extend({}, type);
      resolvedType.code = codeObj;
      return resolvedType;
    });
  } else {
    return Promise.resolve(type);
  }
}

function processGist(response) {
  try {
    return {
      id: response.id,
      revision: {
        id: response.history[0].version,
        date: response.history[0].committed_at
      },
      lastUpdateDate: response.updated_at,
      code: response.files[SINGLE_FILENAME].content,
      author: response.owner ? {
        id: response.owner.id,
        avatar: response.owner.avatar_url,
        login: response.owner.login
      } : {
        id: null,
        avatar: 'https://avatars.githubusercontent.com/u/148100?v=3',
        login: 'anonymous'
      },
      url: response.html_url
    };
  } catch(e) {
    console.log(e);
  }
}

function getById(types, id) {
  for(let i = 0; i < types.length; i++) {
    let type = types[i];
    if(type.id == id) {
      return type;
    }
  }
}

export default {
  getToolbar(token) {
    return auth.getUser(token).then(user => {
      if(!toolbars[user.id]) {
        toolbars[user.id] = defaultToolbar;
      }

      return toolbars[user.id];
    });
  },
  setToolbarItem(token, position, type, id) {
    return auth.getUser(token).then(user => {
      var toolbar = toolbars[user.id];
      toolbar[position] = {type, id};
    });
  },
  removeToolbarItem(token, position) {
    return auth.getUser(token).then(user => {
      var toolbar = toolbars[user.id];
      toolbar[position] = null;
    });
  },
  getAll() {
    return {
      itemTypes,
      blockTypes
    };
  },
  getItemTypes(token, ids) {
    return resolveTypes(token, itemTypes, ids);
  },
  getBlockTypes(token, ids) {
    return resolveTypes(token, blockTypes, ids);
  },
  addBlockType(token, code, material, name) {
    return github.createGist(code, token).then(githubResponse => {
      var newType = {};
      newType.code = {
        id: githubResponse.id,
        revision: githubResponse.history[0].version
      };
      newType.id = ++lastBlockId;
      newType.material = material;
      newType.name = name;
      newType.icon = 'code';
      blockTypes.push(newType);

      return resolveType(token, newType);
    });
  },
  forkBlockType(token, id, code, name) {
    function forkOrCreate(codeId) {
      return github.forkGist(codeId, token).then(forkResponse => {
        return github.updateGist(forkResponse.id, code, token);
      }).catch(err => {
        if(err.statusCode == 422) {
          return github.createGist(code, token);
        } else {
          throw err;
        }
      });
    }

    var oldType = getById(blockTypes, id);
    var newType = extend({}, oldType);

    return forkOrCreate(oldType.code.id).then((githubResponse) => {
      newType.code = {
        id: githubResponse.id,
        revision: githubResponse.history[0].version
      };
      newType.id = ++lastBlockId;
      newType.name = name;
      newType.icon = 'code';
      blockTypes.push(newType);

      return resolveType(token, newType);
    });
  },
  updateBlockType(token, id, code) {
    var oldType = getById(blockTypes, id);
    var newType = extend({}, oldType);

    return github.updateGist(oldType.code.id, code, token).then(githubResponse => {
      newType.code = {
        id: githubResponse.id,
        revision: githubResponse.history[0].version
      };
      newType.id = ++lastBlockId;
      newType.icon = 'code';
      newType.name = oldType.name + ' bis';
      blockTypes.push(newType);

      return resolveType(token, newType);
    });
  }
};
