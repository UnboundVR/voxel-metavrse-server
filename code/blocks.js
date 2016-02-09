var gistIds = localStorage.getItem('gistIds');
if(!gistIds) {
  gistIds = {};
  localStorage.setItem('gistIds', JSON.stringify(gistIds));
} else {
  gistIds = JSON.parse(gistIds);
}

module.exports = {
  getBlocksWithGists: function() {
    return Object.keys(gistIds).map(function(key) {
      return key.split(',');
    });
  },
  getGistId: function(position) {
    return gistIds[position];
  },
  storeGistId: function(position, gistId) {
    gistIds[position] = gistId;
    localStorage.setItem('gistIds', JSON.stringify(gistIds));
  }
};
