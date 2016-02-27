module.exports = {
  onMessage: function(message, broadcast) {
    if (!message.text) {
      return;
    }

    if (message.text.length > 140) {
      message.text = message.text.substr(0, 140);
    }

    if (message.text.length === 0) {
      return;
    }
    
    broadcast(message);
  }
};
