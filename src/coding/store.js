import files from '../fileStorage';

var gistsPath = 'gists.json';

files('coding');

export default {
  saveGists(gists) {
    return files.save(gistsPath, gists);
  },
  loadGists() {
    return files.load(gistsPath);
  }
};
