module.exports = function(io) {
  require('./voxelServer')(io);
  require('./playerSync')(io);
  require('./chat')(io);
  require('./coding')(io);
};
