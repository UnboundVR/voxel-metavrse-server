import chunk from './chunk';
import material from './material';
import item from './itemType';
import block from './blockType';
import sequential from './sequentialId';

export default function(conn) {
  return Promise.all([
    chunk(conn),
    material(conn),
    block(conn),
    item(conn),
    sequential(conn)
  ]);
}
