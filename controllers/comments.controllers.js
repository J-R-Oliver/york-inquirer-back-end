const {
  selectComments,
  insertComment,
  deleteComment,
  updateComment
} = require('../models/comments.models');

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by = 'created_at', order = 'desc' } = req.query;

  selectComments(article_id, sort_by, order)
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes = 0 } = req.body;

  updateComment(comment_id, inc_votes)
    .then(([comment]) => {
      res.send({ comment });
    })
    .catch(next);
};
