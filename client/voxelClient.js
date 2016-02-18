var rle = require('../shared/rle');
var highlight = require('voxel-highlight');
var skin = require('minecraft-skin');
var player = require('voxel-player');
var io = require('socket.io-client');
var engine = require('voxel-engine');

module.exports = Client;

function Client(server) {
  if(!(this instanceof Client)) {
    return new Client(server);
  }

  this.connected = false;
  this.lerpPercent = 0.1;
  this.others = {};
  this.connect(server);
}

Client.prototype.connect = function(server) {
  var self = this;
  var socket = io.connect(server);
  socket.on('disconnect', function() {
    self.connected = false;
  });
  this.socket = socket;
  this.bindEvents(socket);
};

Client.prototype.bindEvents = function(socket) {
  var self = this;
  this.connected = true;

  socket.on('id', function(id) {
    self.playerID = id;
  });

  var processChunk = function(chunk) {
    var voxels = rle.decode(chunk.voxels);
    chunk.voxels = voxels;
    self.game.showChunk(chunk);
  };

  socket.on('settings', function(settings) {
    settings.generateChunks = false;
    self.game = self.createGame(settings);
    socket.emit('created');
    socket.on('chunk', processChunk);
    socket.on('noMoreChunks', function() {
      self.game.voxels.on('missingChunk', function(chunkPosition) {
        socket.emit('requestChunk', chunkPosition, processChunk);
      });
    });
  });

  socket.on('set', function(pos, val) {
    self.game.setBlock(pos, val);
  });
};

Client.prototype.createGame = function(settings) {
  var self = this;
  var socket = this.socket;
  settings.controlsDisabled = false;
  self.game = engine(settings);
  self.game.settings = settings;

  function sendState() {
    if (!self.connected) {
      return;
    }
    var player = self.game.controls.target();
    var state = {
      position: player.yaw.position,
      rotation: {
        y: player.yaw.rotation.y,
        x: player.pitch.rotation.x
      }
    };
    socket.emit('state', state);
  }

  self.game.controls.on('data', function(state) {
    var interacting = false;
    Object.keys(state).map(function(control) {
      if (state[control] > 0) {
        interacting = true;
      }
    });
    
    if (interacting) {
      sendState();
    }
  });

  // setTimeout is because three.js seems to throw errors if you add stuff too soon
  setTimeout(function() {
    socket.on('update', function(updates) {
      Object.keys(updates.positions).map(function(player) {
        var update = updates.positions[player];
        if (player === self.playerID) {
          return self.onServerUpdate(update); // local player
        }
        self.updatePlayerPosition(player, update); // other players
      })
    })
  }, 1000)

  socket.on('leave', function(id) {
    if (!self.others[id]) {
      return;
    }
    self.game.scene.remove(self.others[id].mesh);
    delete self.others[id];
  });

  return self.game;
};

Client.prototype.onServerUpdate = function(update) {
  // TODO use server sent location
};

Client.prototype.updatePlayerPosition = function(id, update) {
  var pos = update.position;
  var player = this.others[id];
  if (!player) {
    var playerSkin = skin(this.game.THREE, 'assets/avatars/player.png', {
      scale: new this.game.THREE.Vector3(0.04, 0.04, 0.04)
    });
    var playerMesh = playerSkin.mesh;
    this.others[id] = playerSkin;
    playerMesh.children[0].position.y = 10;
    this.game.scene.add(playerMesh);
  }

  var playerSkin = this.others[id];
  var playerMesh = playerSkin.mesh;
  playerMesh.position.copy(playerMesh.position.lerp(pos, this.lerpPercent));

  playerMesh.children[0].rotation.y = update.rotation.y + (Math.PI / 2);
  playerSkin.head.rotation.z = scale(update.rotation.x, -1.5, 1.5, -0.75, 0.75);
};

function scale( x, fromLow, fromHigh, toLow, toHigh ) {
  return ( x - fromLow ) * ( toHigh - toLow ) / ( fromHigh - fromLow ) + toLow;
}
