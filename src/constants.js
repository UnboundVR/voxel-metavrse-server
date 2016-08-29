export default {
  github: {
    API_URL: 'https://api.github.com',
    OAUTH_URL: 'https://github.com/login/oauth',
    ANONYMOUS_AVATAR: 'https://avatars.githubusercontent.com/u/148100?v=3'
  },
  chat: {
    MAX_MSG_LENGTH: 1000 // 1s
  },
  voxel: {
    AUTO_SAVE_INTERVAL: 2000 // 5s
  },
  playerSync: {
    AVATAR_INITIAL_POSITION: [0, 2, 0],
    SEND_UPDATE_INTERVAL: 1000/22,  // 45ms
    LERP_PERCENT: 0.1,
    ROUGH_MOVEMENT_THRESHOLD: 20
  }
};
