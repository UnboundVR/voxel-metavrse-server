var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var mockStorage;
var mockEngine;
var mockCompression;

var setup = function() {
  var mockCompression = {

  };

  var mockStorage = {

  };

  var mockEngine = {

  };

  return proxyquire('../src/voxel/controller', {
    './chunkCompression': mockCompression,
    './store': mockStorage,
    './voxelEngine': mockEngine,
  });
};
