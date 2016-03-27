var test = require('tape');
var expandGists = require('../../server/coding/expandGists');
var expandedGists = {
  'id1': {id: 'id1', code: 'asd'},
  'id2': {id: 'id2', code: 'wasd'}
};
var expandedGistsResult = {
  'pos1': expandedGists['id1'],
  'pos2': expandedGists['id2']
};

test('expandGists with successful getGist', function(t) {
  var gists = {
    'pos1': 'id1',
    'pos2': 'id2'
  };

  var getGist = function(id) {
    return Promise.resolve(expandedGists[id]);
  };

  expandGists(gists, getGist).then(function(result) {
    t.deepEqual(result, expandedGistsResult, 'returns expanded gists by position');
    t.end();
  });
});

test('expandGists with faulty getGist', function(t) {
  var gists = {
    'pos1': 'id1',
    'pos2': 'id2'
  };

  var getGist = function(id) {
    return Promise.reject('error');
  };

  expandGists(gists, getGist).catch(function(err) {
    t.pass('Gets error: ' + err);
    t.end();
  });
});
