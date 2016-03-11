var fileStorage = require('../fileStorage')('chunks');
var mongo = require('../mongo');
var Promise = require('promise');

module.exports = {
  saveChunk: function(chunk) {
    var collection = mongo.db.collection('chunks');
    return Promise.denodeify(collection.updateOne).bind(collection)(
      {position: chunk.position},
      {$set: chunk},
      {upsert: true}
    );
    return fileStorage.save(chunkId, chunk);
  },
  loadChunk: function(position) {
    //fileStorage.load(position.join('|')).then(this.saveChunk);
    var collection = mongo.db.collection('chunks');
    return Promise.denodeify(collection.findOne).bind(collection)({position: position}).then(function(doc) {
      //console.log(position, doc)
      return doc;
    });
  }
};
