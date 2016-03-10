module.exports = {
  events: {
    HOVER: 'Hover',
    LEAVE: 'Leave'
  },
  confirmableFunctions: {
    PLACE_ADJACENT: 'PlaceAdjacent',
    EDIT: 'Edit'
  },
  github: {
    REQUESTED_SCOPE: 'user,gist',
    REDIRECT_URI: 'http://localhost:<port>',
    API_URL: 'https://api.github.com',
    OAUTH_URL: 'https://github.com/login/oauth'
  },
  chat: {
    MAX_MSG_LENGTH: 1000 // 1s
  },
  coding: {
    AUTO_SAVE_INTERVAL: 1000 // 1s
  },
  voxel: {
    AUTO_SAVE_INTERVAL: 1000 // 1s
  },
  playerSync: {
    AVATAR_INITIAL_POSITION: [0, 2, 0],
    SEND_UPDATE_INTERVAL: 1000/22,  // 45ms
    LERP_PERCENT: 0.1,
    ROUGH_MOVEMENT_THRESHOLD: 20
  }
};
