const articlesRouter = require('express').Router();
const {
  getArticle,
  patchArticle
} = require('../controllers/articles.controllers');
const {
  postComment,
  getComments
} = require('../controllers/comments.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .all(usMethodHandler);

articlesRouter
  .route('/:article_id/comments')
  .post(postComment)
  .get(getComments)
  .all(usMethodHandler);

module.exports = articlesRouter;
