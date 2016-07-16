import github from './github';

const SINGLE_FILENAME = 'single_file';

function processGist(response) {
  return {
    id: response.id,
    revision: {
      id: response.history[0].version,
      date: response.history[0].committed_at
    },
    lastUpdateDate: response.updated_at,
    code: response.files[SINGLE_FILENAME].content,
    author: response.owner ? {
      id: response.owner.id,
      avatar: response.owner.avatar_url,
      login: response.owner.login
    } : {
      id: null,
      avatar: 'https://avatars.githubusercontent.com/u/148100?v=3',
      login: 'anonymous'
    },
    url: response.html_url
  };
}

function extractUpdateResponse(response) {
  return {
    id: response.id,
    revision: response.history[0].version
  };
}

export default {
  async getGist(token, id, revision) {
    let response = await github.getGist(token, id, revision);

    return processGist(response);
  },
  async forkOrCreateGist(token, id, code) {
    try {
      let forkResponse = await github.forkGist(token, id);
      let response = await github.updateGist(token, forkResponse.id, code);
      return extractUpdateResponse(response);
    } catch(err) {
      if(err.statusCode == 422) {
        let response = await github.createGist(token, code);
        return extractUpdateResponse(response);
      } else {
        throw err;
      }
    }
  },
  async updateGist(token, id, code) {
    let response = await github.updateGist(token, id, code);
    return extractUpdateResponse(response);
  },
  async createGist(token, code) {
    let response = await github.createGist(token, code);
    return extractUpdateResponse(response);
  }
};
