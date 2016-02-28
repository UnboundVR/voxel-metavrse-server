module.exports = {
  init: function(engine) {
    this.engine = engine;

    this.createBlock = engine.createBlock.bind(engine);
    this.setBlock = engine.setBlock.bind(engine);
    this.getBlock = engine.getBlock.bind(engine);
    this.onFire = function(handler) {
      engine.on('fire', handler);
    };
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
