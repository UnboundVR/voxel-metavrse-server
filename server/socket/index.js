module.exports = function(io) {
  require('./voxel')(io);
  require('./playerSync')(io);
  require('./chat')(io);
  require('./coding')(io);

  // TODO use namespaces
};
