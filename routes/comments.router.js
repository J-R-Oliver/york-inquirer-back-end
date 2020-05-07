const commentsRouter = require('express').Router();
const { patchComment } = require('../controllers/comments.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

commentsRouter.route('/:comment_id').patch(patchComment).all(usMethodHandler);

module.exports = commentsRouter;
