const { insertComment, selectComments } = require('../models/comments.models');

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  selectComments(article_id, sort_by, order)
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};
