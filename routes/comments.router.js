const commentsRouter = require('express').Router();
const {
  deleteComment,
  patchComment
} = require('../controllers/comments.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

commentsRouter
  .route('/:comment_id')
  .delete(deleteComment)
  .patch(patchComment)
  .all(usMethodHandler);

module.exports = commentsRouter;
