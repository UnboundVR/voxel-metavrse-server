import ide from '../ide';
import client from './codingClient';
import auth from '../auth';
import executor from './scriptExecutor';

var openNew = function(position) {
  var title = 'Editing the code of the voxel at ' + position;
  var initialCode = 'console.log(\'hello w0rld from '+ position +'\')\n'; // TODO bring from server or something

  return ide.open(title, initialCode).then(function(value) {
    return client.storeCode(position, value).then(function(codeObj) {
      executor.create(position, value);
      alert('New code was created correctly with ID: ' + codeObj.id);
    }, function(err) {
      alert('Error storing code: ' + err);
    });
  });
};

var openExisting = function(position, codeObj) {
  var title = 'Editing the existing code of the voxel at ' + position.join('|') + ' (' + codeObj.id + ')';

  return ide.open(title, codeObj.code).then(function(value) {
    return client.storeCode(position, value).then(function() {
      alert('Existing code was updated correctly');
      executor.update(position, value);
    });
  });
};

export default function(position) {
  if(!auth.isLogged()) {
    return Promise.reject('Please login to be able to edit code');
  }

  if(client.hasCode(position)) {
    return openExisting(position, client.getCode(position));
  } else {
    return openNew(position);
  }
}
