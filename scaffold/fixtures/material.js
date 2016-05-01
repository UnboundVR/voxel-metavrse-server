import r from 'rethinkdb';

export default async function(conn) {
  let materials = {
    materials: [
      "tile",
      "code",
      ["grass", "dirt", "grass_dirt"],
      "obsidian",
      "plank",
      "cobblestone",
      "redwool",
      "troll",
      "doge",
      "glass"
    ]
  };

  await r.db('metavrse').table('material').insert(materials).run(conn);
  console.log(`loaded ${materials.materials.length} materials into the db`);
}
