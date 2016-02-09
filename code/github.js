module.exports = {
  createGist: function(name, content) {
    var body = {
      description: 'metavrse.io code for a block',
      files: {}
    };

    body.files[name] = {
      content: content
    };

    var request = new Request('https://api.github.com/gists', {
    	method: 'POST',
      body: JSON.stringify(body)
    });

    return fetch(request).then(function(response) {
      return response.json();
    }).then(function(response) {
      return response.html_url;
    });
  }
};
