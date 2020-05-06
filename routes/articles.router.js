const articlesRouter = require('express').Router();
const {
  getArticle,
  patchArticle
} = require('../controllers/articles.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .all(usMethodHandler);

module.exports = articlesRouter;
