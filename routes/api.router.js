const apiRouter = require('express').Router();
const { usMethodHandler } = require('../controllers/error.controllers');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');

apiRouter.route('/').all(usMethodHandler);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
