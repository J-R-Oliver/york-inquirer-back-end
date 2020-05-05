const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

topicsRouter.route('/').get(getTopics).all(usMethodHandler);

module.exports = topicsRouter;
