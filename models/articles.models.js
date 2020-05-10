const knex = require('../db/connection');

exports.selectArticles = (sort_by, order, username, topic) => {
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
    .orderBy(sort_by, order)
    .modify(query => {
      if (username && topic) {
        query.where({ 'users.username': username, 'topics.slug': topic });
      } else if (username) {
        query.where({ 'users.username': username });
      } else if (topic) {
        query.where({ 'topics.slug': topic });
      }
    });
};

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
    .where({ 'articles.article_id': article_id })
    .groupBy('articles.article_id', 'users.username', 'topics.slug')
    .then(article => {
      return article.length === 0
        ? Promise.reject({ status: 404, msg: 'Article Not Found' })
        : article;
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return knex('updated_article')
    .with(
      'updated_article',
      knex('articles')
        .where({ 'articles.article_id': article_id })
        .increment('votes', inc_votes)
        .returning('*')
    )
    .select(
      'users.username AS author',
      'updated_article.title',
      'updated_article.article_id',
      'updated_article.body',
      'topics.slug AS topic',
      'updated_article.created_at',
      'updated_article.updated_at',
      'updated_article.votes'
    )
    .count('comments.comment_id', { as: 'comment_count' })
    .join('topics', 'updated_article.topic_id', '=', 'topics.topic_id')
    .join('users', 'updated_article.user_id', '=', 'users.user_id')
    .leftJoin(
      'comments',
      'updated_article.article_id',
      '=',
      'comments.article_id'
    )
    .groupBy(
      'updated_article.article_id',
      'updated_article.title',
      'updated_article.article_id',
      'updated_article.body',
      'updated_article.created_at',
      'updated_article.updated_at',
      'updated_article.votes',
      'users.username',
      'topics.slug'
    )
    .then(article => {
      return article.length === 0
        ? Promise.reject({ status: 404, msg: 'Article Not Found' })
        : article;
    });
};
