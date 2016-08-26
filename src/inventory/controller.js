import defaultToolbar from './data/toolbar.json';
import auth from '../auth';
import clone from 'clone';
import storage from './storage';

let toolbars = {};

async function addBlockOrItem(token, codeObj, props, type) {
  let user = await auth.getUser(token);
  console.log(`Adding new ${type} for user ${user.id}`);

  let add;

  let newType = {
    code: codeObj,
    name: props.name,
    icon: 'code',
    owner: user.id
  };

  if(type == 'item') {
    add = storage.addItemType;
    newType.crosshairIcon = props.crosshairIcon;
    newType.adjacentActive = props.adjacentActive;
  } else {
    add = storage.addBlockType;
    newType.material = props.material;
  }

  await add(newType);

  return newType;
}

async function updateBlockOrItemCode(token, id, codeObj, type) {
  let user = await auth.getUser(token);
  console.log(`Updating ${type} ${id} for user ${user.id}`);

  let get, add, update;

  if(type == 'item') {
    get = storage.getItemType;
    add = storage.addItemType;
    update = storage.updateItemType;
  } else {
    get = storage.getBlockType;
    add = storage.addBlockType;
    update = storage.updateBlockType;
  }

  let original = await get(id);
  if(original.owner != user.id) {
    throw new Error(`${type} ${id} belongs to ${original.owner} - ${user.id} doesn't have access.`);
  }

  let updated = clone(original);
  updated.code = codeObj;
  delete updated.newerVersion;
  await add(updated);

  original.newerVersion = updated.id;
  await update(original);

  return updated;
}

export default {
  async getToolbar(token) {
    let user = await auth.getUser(token);

    if(!toolbars[user.id]) {
      toolbars[user.id] = defaultToolbar;
    }

    return toolbars[user.id];
  },
  async setToolbarItem(token, position, type, id) {
    let user = await auth.getUser(token);

    let toolbar = toolbars[user.id];
    toolbar[position] = {type, id};
  },
  async removeToolbarItem(token, position) {
    let user = await auth.getUser(token);

    let toolbar = toolbars[user.id];
    toolbar[position] = null;
  },
  async getAll() {
    let itemTypes = await storage.getAllItemTypes();
    let blockTypes = await storage.getAllBlockTypes();

    return {
      itemTypes,
      blockTypes
    };
  },
  async getItemTypes(token, ids) {
    return await storage.getItemTypes(ids);
  },
  async getBlockTypes(token, ids) {
    return await storage.getBlockTypes(ids);
  },
  async updateBlockCode(token, id, codeObj) {
    return await updateBlockOrItemCode(token, id, codeObj, 'block');
  },
  async updateItemCode(token, id, codeObj) {
    return await updateBlockOrItemCode(token, id, codeObj, 'item');
  },
  async addBlockType(token, codeObj, props) {
    return await addBlockOrItem(token, codeObj, props, 'block');
  },
  async addItemType(token, codeObj, props) {
    return await addBlockOrItem(token, codeObj, props, 'item');
  }
};
