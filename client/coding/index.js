import client  from './codingClient';
import executor  from './scriptExecutor';
import voxelEngine  from '../voxelEngine';
import editCode  from './editCode';

export default {
  init: function() {
    client.init().then(function() {
      client.getBlocksWithCode().forEach(function(block) {
        executor.create(block.position, block.codeObj.code);
        voxelEngine.setBlock(block.position, 2);
      });
    });
  },
  editCode: editCode,
  confirm: executor.confirm,
  removeCode: function(position) {
    if(client.hasCode(position)) {
      client.removeCode(position);
      executor.remove(position);
    }
  }
};
