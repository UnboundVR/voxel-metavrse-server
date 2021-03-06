// Taken from http://www.rosettacode.org/wiki/Run-length_encoding#JavaScript
function rlEncode(input) {
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
}

var cache = {};

export default {
  compress(position, voxels) {
    if(!cache[position]) {
      cache[position] = rlEncode(voxels);
    }

    return cache[position];
  },
  invalidateCache(position) {
    delete cache[position];
  }
};
