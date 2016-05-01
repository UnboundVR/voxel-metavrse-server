import chunk from './chunk';
import material from './material';

export default function(conn) {
  return Promise.all([
    chunk(conn),
    material(conn)
  ]);
}
