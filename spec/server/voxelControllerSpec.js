var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var setup = function() {

  return proxyquire('../../server/voxel/controller', {
  });
};
