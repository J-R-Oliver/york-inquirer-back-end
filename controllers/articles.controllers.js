const {
  selectArticles,
  selectArticle,
  insertArticle,
  deleteArticle,
  updateArticle
} = require('../models/articles.models');
const { selectUser } = require('../models/users.models');
const { selectTopic } = require('../models/topics.models');

exports.getArticles = (req, res, next) => {
  const {
    sort_by = 'created_at',
    order = 'desc',
    author: username,
    topic
  } = req.query;

  const promiseArr = [selectArticles(sort_by, order, username, topic)];

  if (username) promiseArr.push(selectUser(username));
  if (topic) promiseArr.push(selectTopic(topic));

  Promise.all(promiseArr)
    .then(([articles]) => {
      res.send({ articles });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  selectArticle(article_id)
    .then(([article]) => {
      res.send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { username, topic, title, body } = req.body;

  const promiseArr = [
    insertArticle(username, topic, title, body),
    selectUser(username),
    selectTopic(topic)
  ];

  Promise.all(promiseArr)
    .then(([[article]]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;

  deleteArticle(article_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes = 0 } = req.body;

  updateArticle(article_id, inc_votes)
    .then(([article]) => {
      res.send({ article });
    })
    .catch(next);
};
