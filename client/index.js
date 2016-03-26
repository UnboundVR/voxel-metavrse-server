import client from './voxelClient';
import auth from './auth';
import coding from './coding';
import blockPlacement from './blockPlacement';
import playerSync from './playerSync';
import voxelEngine from './voxelEngine';
import chat from './chat';
import toolbar from './toolbar';
import ide from './ide';
import rootVue from './rootVue';

export default function() {
  auth.init().then(() => {
    client.init().then(() => {
      voxelEngine.init(client.engine);

      Promise.all([
        blockPlacement.init(),
        playerSync.init(),
        chat.init(),
        coding.init(),
        toolbar.init(),
        ide.init()
      ]).then(() => {
        try {
          voxelEngine.appendToContainer();
        } catch(err) {
          console.log('Browser not capable');
        }

        rootVue.init();
      }).catch((err) => {
        console.log('Error initializing some modules', err);
        throw err;
      });
    });
  });
}
