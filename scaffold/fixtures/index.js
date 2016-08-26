import chunk from './chunk';
import material from './material';
import item from './itemType';
import block from './blockType';
import sequential from './sequentialId';

export default async function(conn) {
  let materialsCreated = await material(conn);
  let itemsCreated = await item(conn);
  let blocksCreated = await block(conn);

  await sequential(conn, {
    material: materialsCreated + 1,
    item: itemsCreated + 1,
    block: blocksCreated + 2 // this is because we're not creating any blockType with ID 1
  });

  await chunk(conn);
}
