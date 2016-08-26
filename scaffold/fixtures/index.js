import chunk from './chunk';
import material from './material';
import item from './itemType';
import block from './blockType';
import sequential from './sequentialId';

export default async function(conn, ownerUserId) {
  let materialsCreated = await material(conn, ownerUserId);
  let itemsCreated = await item(conn, ownerUserId);
  let blocksCreated = await block(conn, ownerUserId);

  await sequential(conn, {
    material: materialsCreated + 1,
    item: itemsCreated + 1,
    block: blocksCreated + 2 // this is because we're not creating any blockType with ID 1
  });

  await chunk(conn);
}
