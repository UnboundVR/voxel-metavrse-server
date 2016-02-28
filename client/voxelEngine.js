module.exports = {
  init: function(engine) {
    this.engine = engine;
  },
  appendToContainer: function() {
    var engine = this.engine;

    var container = document.getElementById('container');
    engine.appendTo(container);

    return new Promise(function(resolve, reject) {
      if (engine.notCapable()) {
        reject();
      } else {
        resolve();
      }
    });
  },
  isOfType: function(pos, type) {
    return this.engine.getBlock(pos) == type;
  }
};
