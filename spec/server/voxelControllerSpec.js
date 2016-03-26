var test = require('tape');
var Promise = require('promise');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var mockStore;
var settings = {
  chunkDistance: 2,
  worldOrigin: [0, 0, 0]
};
var CHUNK_SIZE = 32;

var setup = function(success) {
  mockStore = {
    saveChunk: sinon.stub().returns(success ? Promise.resolve() : Promise.reject('error')),
    loadChunk: sinon.spy(function(position) {
      if(!success) {
        return Promise.reject('error');
      }

      return Promise.resolve({
        dims: [CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE],
        position: position,
        voxels: new Array(CHUNK_SIZE*CHUNK_SIZE*CHUNK_SIZE).fill(0)
      });
    })
  };

  return proxyquire('../../server/voxel/controller', {
    './store': mockStore,
    '../../shared/voxelSettings.json': settings
  });
};

test('VoxelController::initClient when load works fine', function(t) {
  var controller = setup(true);
  controller.initClient().then(function(result) {
    t.equals(result.size, 16, 'contains correct amount of chunks');
    t.end();
  });
});

test('VoxelController::initClient when load fails', function(t) {
  var controller = setup(false);
  t.end();
});
