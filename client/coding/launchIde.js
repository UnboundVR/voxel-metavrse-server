import ide from '../ide';
import client from './codingClient';
import auth from '../auth';
import executor from './scriptExecutor';

var openNew = function(position) {
  var code = 'console.log(\'hello w0rld from '+ position +'\')\n'; // TODO bring from server or something

  return ide.open({position, code}).then(value => {
    return client.storeCode(position, value).then(codeObj => {
      executor.create(position, value);
      alert('New code was created correctly with ID: ' + codeObj.id);
    }, err => {
      alert('Error storing code: ' + err);
    });
  });
};

var openExisting = function(position, codeObj) {
  return ide.open({position, code: codeObj.code, id: codeObj.id}).then(value => {
    return client.storeCode(position, value).then(() => {
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
