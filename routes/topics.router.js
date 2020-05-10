const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/topics.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

topicsRouter.route('/').get(getTopics).post(postTopic).all(usMethodHandler);

module.exports = topicsRouter;
