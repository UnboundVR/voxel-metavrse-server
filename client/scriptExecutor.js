// TODO register and unregister event handlers

var create = function(position, code) {
  eval(code);
  subscribeToEvents(code);
};

var update = function(position, code) {
  remove(position);
  create(position, code);
};

var remove = function(position) {
  console.log('removing code at ' + position);
  unsubscribeToEvents(code);
};

function subscribeToEvents(code) {

}

function unsubscribeToEvents(code) {

}

module.exports = {
  create: create,
  update: update,
  remove: remove
};
