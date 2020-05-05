const articlesRouter = require('express').Router();
const { getArticle } = require('../controllers/articles.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

articlesRouter.route('/:article_id').get(getArticle).all(usMethodHandler);

module.exports = articlesRouter;
