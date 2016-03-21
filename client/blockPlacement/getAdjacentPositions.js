export default function(pos) {
  var adj = [];

  adj.push([pos[0] + 1, pos[1], pos[2]]);
  adj.push([pos[0], pos[1] + 1, pos[2]]);
  adj.push([pos[0], pos[1], pos[2] + 1]);
  adj.push([pos[0] - 1, pos[1], pos[2]]);
  adj.push([pos[0], pos[1] - 1, pos[2]]);
  adj.push([pos[0], pos[1], pos[2] - 1]);

  return adj;
};
