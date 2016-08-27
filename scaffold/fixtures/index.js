import chunk from './chunk';
import material from './material';
import item from './itemType';
import block from './blockType';
import sequential from './sequentialId';
import toolbar from './toolbar';

export default async function(conn, userId) {
  let materialsCreated = await material(conn, userId);
  let itemsCreated = await item(conn, userId);
  let blocksCreated = await block(conn, userId);

  await sequential(conn, {
    material: materialsCreated + 1,
    item: itemsCreated + 1,
    block: blocksCreated + 2 // this is because we're not creating any blockType with ID 1
  });

  if(userId != 0) {
    await toolbar(conn, userId);
  }

  await chunk(conn);
}
