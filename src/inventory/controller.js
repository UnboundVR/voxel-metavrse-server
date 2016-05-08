import itemTypes from './data/itemTypes.json';
import blockTypes from './data/blockTypes.json';
import defaultToolbar from './data/toolbar.json';
import clone from 'clone';
import coding from '../coding';
import auth from '../auth';

var toolbars = {};

var lastBlockId = 0;
blockTypes.forEach(blockType => {
  if(blockType.id > lastBlockId) {
    lastBlockId = blockType.id;
  }
});

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
    if(typeof ids == 'string') {
      ids = ids.split(',');
    }

    return itemTypes.filter(type => ids.includes(type.id.toString()));
  },
  getBlockTypes(token, ids) {
    if(typeof ids == 'string') {
      ids = ids.split(',');
    }

    return blockTypes.filter(type => ids.includes(type.id.toString()));
  },
  addBlockType(token, code, material, name) {
    return coding.createGist(token, code).then(gistId => {
      var newType = {};
      newType.code = gistId;
      newType.id = ++lastBlockId;
      newType.material = material;
      newType.name = name;
      newType.icon = 'code';
      blockTypes.push(newType);

      return newType;
    });
  },
  forkBlockType(token, id, code, name) {
    var oldType = getById(blockTypes, id);
    var newType = clone(oldType);

    return coding.forkOrCreate(token, oldType.code.id, code).then((gistId) => {
      newType.code = gistId;
      newType.id = ++lastBlockId;
      newType.name = name;
      newType.icon = 'code';
      blockTypes.push(newType);

      return newType;
    });
  },
  updateBlockType(token, id, code) {
    var oldType = getById(blockTypes, id);
    var newType = clone(oldType);

    return coding.updateGist(token, oldType.code.id, code).then(gistId => {
      newType.code = gistId;
      newType.id = ++lastBlockId;
      newType.icon = 'code';
      newType.name = oldType.name + ' bis';
      blockTypes.push(newType);

      return newType;
    });
  }
};
