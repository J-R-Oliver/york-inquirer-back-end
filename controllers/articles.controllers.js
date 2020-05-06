const { selectArticle, updateArticle } = require('../models/articles.models');

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  selectArticle(article_id)
    .then(([article]) => {
      res.send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticle(article_id, inc_votes)
    .then(([article]) => {
      res.send({ article });
    })
    .catch(next);
};
