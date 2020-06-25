const { readEndpointInfo } = require('../models/api.models');

exports.getEndpointInfo = (req, res, next) => {
  try {
    const endpointInfo = readEndpointInfo();
    res.send(endpointInfo);
  } catch (err) {
    next(err);
  }
};
