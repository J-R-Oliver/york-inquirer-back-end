const { readEndpointInfo } = require('../models/api.models');

exports.getEndpointInfo = (req, res, next) => {
  readEndpointInfo()
    .then(endpointInfo => {
      res.send(endpointInfo);
    })
    .catch(next);
};
