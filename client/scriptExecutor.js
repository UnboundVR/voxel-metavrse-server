// TODO register and unregister event handlers

module.exports = {
  create: function(position, code) {
    eval(code);
  },
  update: function(position, code) {
    eval(code);
  },
  remove: function(position) {
    console.log('removing code at ' + position);
  }
};
