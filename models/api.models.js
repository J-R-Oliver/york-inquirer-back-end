const {
  promises: { readFile }
} = require('fs');

exports.readEndpointInfo = () => {
  return readFile('endpoints_info.json', 'utf-8').then(endpointInfoString => {
    return JSON.parse(endpointInfoString);
  });
};
