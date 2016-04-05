import files from '../fileStorage';

var gistsPath = 'gists.json';

export default {
  saveGists(gists) {
    return files('coding').save(gistsPath, gists);
  },
  loadGists() {
    return files('coding').load(gistsPath);
  }
};
