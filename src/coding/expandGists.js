export default function(gists, getGist) {
  let result = {};
  let promises = Object.keys(gists).map(position => {
    return getGist(gists[position]).then(codeObj => {
      result[position] = codeObj;
    });
  });

  return Promise.all(promises).then(() => {
    return result;
  });
}
