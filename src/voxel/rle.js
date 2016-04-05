export default {
  // Taken from http://www.rosettacode.org/wiki/Run-length_encoding#JavaScript
  encode(input) {
    let encoding = [];
    let prev;
    let count;
    let i;

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
  decode(input) {
    let output = [];
    input.forEach(item => {
      for (var i = 0; i < item[0]; i++) {
        output.push(item[1]);
      }
    });

    return output;
  }
};
