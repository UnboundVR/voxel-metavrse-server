var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/metavrse';

var mongoDb;

module.exports = {
  init: function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if(err) {
          reject(err);
        } else {
          console.log("Connected correctly to mongo");
          self.db = db;
          resolve();
        }
      });
    });
  }
};
