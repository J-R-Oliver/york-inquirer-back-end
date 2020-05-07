const knex = require('../db/connection');

exports.selectArticle = article_id => {
  return knex('articles')
    .select(
      'users.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.body',
      'topics.slug AS topic',
      'articles.created_at',
      'articles.updated_at',
      'articles.votes'
    )
    .count('comments.comment_id', { as: 'comment_count' })
    .join('topics', 'articles.topic_id', '=', 'topics.topic_id')
    .join('users', 'articles.user_id', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where('articles.article_id', article_id)
    .groupBy('articles.article_id', 'users.username', 'topics.slug')
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      }
      return article;
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: 'Invalid Request Body' });
  }

  return knex('articles')
    .where('articles.article_id', article_id)
    .increment('votes', inc_votes)
    .then(() => {
      return exports.selectArticle(article_id);
    })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      }
      return article;
    });
};

exports.selectArticles = (sort_by, order, username, topic, invalidQueries) => {
  if (Object.keys(invalidQueries).length) {
    return Promise.reject({ status: 400, msg: 'Invalid Request Query' });
  }

  const sortBy = sort_by || 'created_at';

  return knex('articles')
    .select(
      'users.username AS author',
      'articles.title',
      'articles.article_id',
      'topics.slug AS topic',
      'articles.created_at',
      'articles.updated_at',
      'articles.votes'
    )
    .count('comments.comment_id', { as: 'comment_count' })
    .join('topics', 'articles.topic_id', '=', 'topics.topic_id')
    .join('users', 'articles.user_id', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id', 'users.username', 'topics.slug')
    .orderBy(sortBy, order)
    .modify(query => {
      if (username && topic) {
        query.where({ 'users.username': username, 'topics.slug': topic });
      } else if (username) {
        query.where({ 'users.username': username });
      } else if (topic) {
        query.where({ 'topics.slug': topic });
      }
    })
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: 'Articles Not Found' });
      }
      return articles;
    });
};
