const commentsRouter = require('express').Router();
const {
  patchComment,
  deleteComment
} = require('../controllers/comments.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(usMethodHandler);

module.exports = commentsRouter;
