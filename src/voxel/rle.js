module.exports = {
  // Taken from http://www.rosettacode.org/wiki/Run-length_encoding#JavaScript
  encode: function(input) {
    var encoding = [];
    var prev, count, i;
    for (count = 1, prev = input[0], i = 1; i < input.length; i++) {
      if (input[i] != prev) {
        encoding.push([count, prev]);
        count = 1;
        prev = input[i];
      } else {
        count ++;
      }
    }
    encoding.push([count, prev]);
    return encoding;
  },
  decode: function(input) {
    var output = [];
    input.forEach(function(item) {
      for(var i = 0; i < item[0]; i++) {
        output.push(item[1]);
      }
    });

    return output;
  }
};
