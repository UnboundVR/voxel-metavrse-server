import client  from './codingClient';
import executor  from './scriptExecutor';
import voxelEngine  from '../voxelEngine';
import launchIde from './launchIde';

export default {
  init() {
    client.init().then(() => {
      client.getBlocksWithCode().forEach(block => {
        executor.create(block.position, block.codeObj.code);
        voxelEngine.setBlock(block.position, 2);
      });
    });
  },
  editCode: launchIde,
  confirm: executor.confirm,
  removeCode(position) {
    if(client.hasCode(position)) {
      client.removeCode(position);
      executor.remove(position);
    }
  }
};
