var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var mockGithub;
var mockStorage;
var mockExpandGists;
var token = 'some token';
var code = 'some code';
var expandedGists = [1,2,3];
var existingGistId = 'c381f9564c7a46e17fff';
var existingPosition = '-10|2|13';
var newPosition = '1|2|3';
var newGistId = 'asdasdasd';
var gists;
// FIXME this does not consider cases when github fails - also we need to update it for granular storage in mongo, plus maybe chunk-based storage

// TODO pass a single object for successes, so it's clearer in the tests :)
var setup = function(storageSuccess, githubSuccess, saveSuccess) {
  gists = {};
  gists[existingPosition] = existingGistId;

  mockGithub = {
    updateGist: sinon.stub()
      .withArgs(existingGistId, code, token)
      .returns(githubSuccess ? Promise.resolve() : Promise.reject('error')),
    createGist: sinon.stub()
      .withArgs(code, token)
      .returns(githubSuccess ? Promise.resolve({id: newGistId}) : Promise.reject(''))
  };

  var loadGistsResponse;
  if(storageSuccess === true) {
    loadGistsResponse = Promise.resolve(gists);
  } else if(storageSuccess === null) {
    loadGistsResponse = Promise.resolve(null);
  } else {
    loadGistsResponse = Promise.reject('error');
  }
  mockStorage = {
    loadGists: sinon.stub()
      .returns(loadGistsResponse),
    saveGists: sinon.stub()
      .withArgs(gists)
      .returns(saveSuccess ? Promise.resolve() : Promise.reject('error'))
  };

  mockExpandGists = sinon.stub().returns(
    githubSuccess ? Promise.resolve(expandedGists) : Promise.reject('error')
  );

  return proxyquire('../../server/coding/controller', {
    './github': mockGithub,
    './store': mockStorage,
    '../../shared/coding/expandGists': mockExpandGists
  });
};

test('CodingController::init should load gists if they exist', function(t) {
  var controller = setup(true, true);

  controller.init().then(function() {
    t.ok(mockStorage.loadGists.called, 'loadGists is called');
    t.deepEqual(controller.getGistIds(), gists, 'gists are brought ok');
    t.end();
  }).catch(t.fail);
});

test('CodingController::init should throw if there is a file error', function(t) {
  var controller = setup(false, true);

  controller.init().catch(function(err) {
    t.pass('we got error: ' + err);
    t.end();
  });
});

test('CodingController::init should initialize with no gists if there is no gists file', function(t) {
  var controller = setup(null, true);

  controller.init().then(function() {
    t.ok(mockStorage.loadGists.called, 'loadGists is called');
    t.deepEqual(controller.getGistIds(), {}, 'gists are brought ok');
    t.end();
  }).catch(t.fail);
});

test('CodingController::getAllCode returns gists dict if no token passed', function(t) {
  var controller = setup(true, false);

  controller.init().then(function() {
    controller.getAllCode().then(function(controllerGists) {
      t.ok(!mockExpandGists.called, 'expandGists not called');
      t.deepEqual(controllerGists, gists, 'gists are brought ok');
      t.end();
    });
  }).catch(t.fail);
});

test('CodingController::getAllCode returns expanded gists if token is passed', function(t) {
  var controller = setup(true, true);

  controller.init().then(function() {
    controller.getAllCode(token).then(function(controllerGists) {
      t.ok(mockExpandGists.called, 'expandGists called');
      t.deepEqual(controllerGists, expandedGists, 'gists are brought ok');
      t.end();
    });
  }).catch(t.fail);
});

test('CodingController::getAllCode with token throws if expandGists has error', function(t) {
  var controller = setup(true, false);

  controller.init().then(function() {
    controller.getAllCode(token).catch(function(err) {
      t.ok(mockExpandGists.called, 'expandGists called');
      t.pass('we got error: ' + err);
      t.end();
    });
  }).catch(t.fail);
});

test('CodingController::onCodeChanged when code exists on that position', function(t) {
  var controller = setup(true, true);
  var broadcast = sinon.spy();

  controller.init().then(function() {
    controller.onCodeChanged(existingPosition, code, token, broadcast).then(function(codeObj) {
      t.ok(!mockStorage.saveGists.called, 'does not save gists');
      t.ok(mockGithub.updateGist.calledWith(existingGistId, code, token), 'updates code in Github');
      t.ok(broadcast.calledWith(existingPosition, codeObj), 'broadcasts position and code object');
      t.deepEqual(codeObj, {id: existingGistId, code: code}, 'returns object with id and code');
      t.end();
    });
  }).catch(t.fail);
});

test('CodingController::onCodeChanged when code does not exist on that position', function(t) {
  var controller = setup(true, true, true);
  var broadcast = sinon.spy();

  controller.init().then(function() {
    controller.onCodeChanged(newPosition, code, token, broadcast).then(function(codeObj) {
      t.ok(mockGithub.createGist.calledWith(code, token), 'creates code in Github');
      t.ok(broadcast.calledWith(newPosition, codeObj), 'broadcasts position and code object');
      t.deepEqual(codeObj, {id: newGistId, code: code}, 'returns object with id and code');

      t.equal(controller.getGistIds()[newPosition], newGistId, 'stores gistId in new position');
      t.end();
    });
  }).catch(t.fail);
});

test('CodingController::onCodeRemoved', function(t) {
  var controller = setup(true, true, true);
  var broadcast = sinon.spy();

  controller.init().then(function() {
    controller.onCodeRemoved(existingPosition, broadcast);
    t.ok(broadcast.calledWith(existingPosition), 'broadcasts position of removed code');
    t.deepEqual(controller.getGistIds(), {}, 'removes code from that position');
    t.end();
  }).catch(t.fail);
});
