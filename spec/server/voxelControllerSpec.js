var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

var mockStorage;
var mockEngine;
var mockCompression;

var setup = function() {
  return proxyquire('../../server/voxel/controller', {
    './chunkCompression': mockCompression,
    './store': mockStorage,
    './voxelEngine': mockEngine,
  });
};
