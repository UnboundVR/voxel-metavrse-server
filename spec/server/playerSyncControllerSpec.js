var test = require('tape');
var sinon = require('sinon');
var consts = require('../../server/constants');
var playerSync = require('../../server/playerSync/controller');
var THREE = require('three');

var testId = 'id1';
var testId2 = 'id2';
var initialPosition = consts.playerSync.AVATAR_INITIAL_POSITION;
var initialPositionVector = new THREE.Vector3();
initialPositionVector.set(initialPosition[0], initialPosition[1], initialPosition[2]);

var slightlyMovedVector = new THREE.Vector3();
slightlyMovedVector.set(initialPosition[0] + consts.playerSync.ROUGH_MOVEMENT_THRESHOLD / 10, initialPosition[1], initialPosition[2]);

var brutallyMovedVector = new THREE.Vector3();
brutallyMovedVector.set(initialPosition[0], initialPosition[1] + consts.playerSync.ROUGH_MOVEMENT_THRESHOLD * 1000, initialPosition[2]);

var initialRotationXY = {
  x: 0,
  y: 0
};

var setup = function() {
  playerSync.onLeave(testId, function() {});
  playerSync.onLeave(testId2, function() {});
};

test('PlayerSyncController::onJoin', function(t) {
  setup();
  var broadcast = sinon.spy();
  playerSync.onJoin(testId, broadcast);

  t.ok(broadcast.calledWith(testId), 'should call broadcast with id passed');
  playerSync.sendUpdates(function(update) {
    var playerInfo = update.positions[testId];
    t.deepEqual(playerInfo.position, initialPositionVector, 'position should be equal to initial as defined in consts');
    t.deepEqual(playerInfo.rotation, initialRotationXY, 'rotation should be equal to zero');
    t.end();
  });
});

test('PlayerSyncController::onLeave', function(t) {
  setup();
  var broadcast = sinon.spy();
  playerSync.onJoin(testId, function() {});
  playerSync.onJoin(testId2, function() {});
  playerSync.onLeave(testId, broadcast);

  t.ok(broadcast.calledWith(testId), 'should call broadcast with id passed');
  playerSync.sendUpdates(function(update) {
    var playerInfo = update.positions[testId];
    t.ok(!playerInfo, 'there should be no info for a player that left');
    t.end();
  });
});

test('PlayerSyncController::sendUpdates', function(t) {
  setup();
  var broadcast = sinon.spy();
  playerSync.sendUpdates(broadcast);
  t.ok(!broadcast.called, 'doesnt call callback if there are no logged users');

  playerSync.onJoin(testId, function() {});
  playerSync.onJoin(testId2, function() {});

  var now = new Date();
  playerSync.sendUpdates(function(update) {
    t.pass('calls callback if there is at least one logged user');
    t.equal(Object.keys(update.positions).length, 2, 'contains information of all logged users');
    t.deepEqual(update.date, now, 'date should be now');
    t.end();
  });
});

test('PlayerSyncController::onState when movement is normal', function(t) {
  setup();
  playerSync.onJoin(testId, function() {});
  var state = {
    position: slightlyMovedVector,
    rotation: new THREE.Vector3(1, 2)
  };
  playerSync.onState(testId, state);

  playerSync.sendUpdates(function(update) {
    var playerInfo = update.positions[testId];
    t.deepEqual(playerInfo.rotation, {x: 1, y: 2}, 'should alter rotation');
    t.deepEqual(playerInfo.position, state.position, 'should alter position if the movement is not too rough');
    t.end();
  });
});

test('PlayerSyncController::onState when movement is rough', function(t) {
  setup();
  playerSync.onJoin(testId, function() {});
  var state = {
    position: brutallyMovedVector,
    rotation: new THREE.Vector3()
  };
  playerSync.onState(testId, state);

  playerSync.sendUpdates(function(update) {
    var lerpedYPosition = initialPosition[1] + (consts.playerSync.ROUGH_MOVEMENT_THRESHOLD * 1000 * consts.playerSync.LERP_PERCENT);
    var playerInfo = update.positions[testId];
    t.deepEqual(playerInfo.rotation, {x: 0, y: 0}, 'should alter rotation');
    t.deepEqual(playerInfo.position, {x: state.position.x, y: lerpedYPosition, z: state.position.z}, 'should lerp position vector');
    t.end();
  });
});
