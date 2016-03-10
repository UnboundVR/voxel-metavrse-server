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
    './githubAuth': mockGithubAuth,
  });
};

test('AuthController::getAccessToken should return token if github request succeeds', function(t) {
  var controller = setup(true);

  controller.getAccessToken(code).then(function(authToken) {
    t.ok(mockGithubAuth.getAccessToken.calledWith(code), 'githubAuth is called');
    t.equal(authToken, token, 'authToken is ok');
    t.end();
  }).catch(t.fail);
});

test('AuthController::getAccessToken should throw error code if github request fails', function(t) {
  var controller = setup(false);

  controller.getAccessToken(code).catch(function(errorCode) {
    t.ok(mockGithubAuth.getAccessToken.calledWith(code), 'githubAuth is called');
    t.equal(errorCode, error, 'errorCode is ok');
    t.end();
  });
});
