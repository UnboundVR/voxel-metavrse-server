export default {
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

    if (engine.notCapable()) {
      throw new Error('Browser not capable');
    }
    
    var container = document.getElementById('container');
    engine.appendTo(container);
  },
  isOfType: function(pos, type) {
    return this.engine.getBlock(pos) == type;
  },
  clearBlock: function(pos) {
    this.engine.setBlock(pos, 0);
  }
};
