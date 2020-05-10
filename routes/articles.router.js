const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticle,
  postArticle,
  deleteArticle,
  patchArticle
} = require('../controllers/articles.controllers');
const {
  getComments,
  postComment
} = require('../controllers/comments.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

articlesRouter
  .route('/')
  .get(getArticles)
  .post(postArticle)
  .all(usMethodHandler);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .delete(deleteArticle)
  .patch(patchArticle)
  .all(usMethodHandler);

articlesRouter
  .route('/:article_id/comments')
  .get(getComments)
  .post(postComment)
  .all(usMethodHandler);

module.exports = articlesRouter;
