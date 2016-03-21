var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var mockGithubAuth;
var code = 'some code';
var token = 'some token';
var error = 'some error';

var setup = function(authSuccess) {
  mockGithubAuth = {
    getAccessToken: sinon.stub()
    .withArgs(code)
    .returns(Promise.resolve(authSuccess ? {access_token: token} : {error: error}))
  };

  return proxyquire('../../server/auth/controller', {
    './githubAuth': mockGithubAuth
  });
};

test('AuthController::getAccessToken', function(t) {
  var controller = setup(true);

  controller.getAccessToken(code).then(function(authToken) {
    t.ok(mockGithubAuth.getAccessToken.calledWith(code), 'githubAuth is called');
    t.equal(authToken, token, 'returns auth token if github request succeeds');
    t.end();
  }).catch(t.fail);
});

test('AuthController::getAccessToken', function(t) {
  var controller = setup(false);

  controller.getAccessToken(code).catch(function(errorCode) {
    t.ok(mockGithubAuth.getAccessToken.calledWith(code), 'githubAuth is called');
    t.equal(errorCode, error, 'throws error code if github request fails');
    t.end();
  });
});
