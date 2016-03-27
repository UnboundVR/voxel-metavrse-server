import github from './github';
import executor from './scriptExecutor';
import voxelEngine from '../voxelEngine';
import blocks from '../blocks';
import expandGists from './expandGists';
import auth from '../auth';
import io from 'socket.io-client';

var blocksWithCode;
var socket;

export default {
  init() {
    socket = io.connect(location.host + '/coding');
    return new Promise(function(resolve, reject) {
      socket.emit('requestAllCode', auth.getAccessToken(), (err, response) => {
        if(err) {
          reject(new Error('Error fetching code. ' + err));
        }

        if(auth.isLogged()) {
          blocksWithCode = response;
          resolve();
        } else {
          expandGists(response, github.getGist).then(result => {
            blocksWithCode = result;
            resolve();
          });
        }
      });
      socket.on('codeChanged', (position, codeObj) => {
        console.log('codeChanged');
        blocksWithCode[position] = codeObj;
        executor.update(position, codeObj.code);
        voxelEngine.setBlock(position, blocks.types.CODE.number);
      });
      socket.on('codeRemoved', position => {
        delete blocksWithCode[position];
        executor.remove(position);
      });
    });
  },
  getBlocksWithCode() {
    var result = [];
    Object.keys(blocksWithCode).forEach(pos => {
      result.push({
        position: pos.split(','),
        codeObj: blocksWithCode[pos]
      });
    });
    return result;
  },
  getCode(position) {
    return blocksWithCode[position];
  },
  hasCode(position) {
    return !!blocksWithCode[position];
  },
  storeCode(position, code) {
    return new Promise(function(resolve, reject) {
      socket.emit('codeChanged', position, code, auth.getAccessToken(), (err, codeObj) => {
        if(err) {
          reject(err);
        } else {
          blocksWithCode[position] = codeObj;
          resolve(codeObj);
        }
      });
    });
  },
  removeCode(position) {
    delete blocksWithCode[position];
    socket.emit('codeRemoved', position);
  }
};
