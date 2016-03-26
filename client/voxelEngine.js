export default {
  init(engine) {
    this.engine = engine;

    this.createBlock = engine.createBlock.bind(engine);
    this.setBlock = engine.setBlock.bind(engine);
    this.getBlock = engine.getBlock.bind(engine);
    this.onFire = function(handler) {
      engine.on('fire', handler);
    };
  },
  appendToContainer() {
    var engine = this.engine;

    if (engine.notCapable()) {
      throw new Error('Browser not capable');
    }

    var container = document.getElementById('container');
    engine.appendTo(container);
  },
  isOfType(pos, type) {
    return this.engine.getBlock(pos) == type;
  },
  clearBlock(pos) {
    this.engine.setBlock(pos, 0);
  }
};
