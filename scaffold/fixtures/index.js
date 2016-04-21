import chunk from './chunk';

export default function(conn) {
  return Promise.all([chunk(conn)]); // This uses Promise.all because there will be more fixtures :) (TODO remove this comment when there are more)
}
