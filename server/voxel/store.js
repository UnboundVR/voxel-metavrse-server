// var fileStorage = require('../fileStorage')('chunks');
var mongo = require('../mongo');
var Promise = require('promise');

module.exports = {
  saveChunk: function(chunk) {
    var collection = mongo.db.collection('chunks');
    return Promise.denodeify(collection.updateOne).bind(collection)(
      chunk._id ? {_id: chunk._id} : {position: chunk.position},
      {$set: chunk},
      {upsert: true}
    );
  },
  loadChunk: function(position) {
    var collection = mongo.db.collection('chunks');
    return Promise.denodeify(collection.findOne).bind(collection)({position: position});
  }
};
