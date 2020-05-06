const { selectArticle } = require('../models/articles.models');

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  selectArticle(article_id)
    .then(([article]) => {
      res.send({ article });
    })
    .catch(next);
};
