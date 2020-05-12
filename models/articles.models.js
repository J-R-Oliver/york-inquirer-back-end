const knex = require('../db/connection');

exports.selectArticleCount = (username, slug) => {
  return knex
    .count('*', { as: 'total_count' })
    .from(function select_articles() {
      this.select('articles.article_id')
        .from('articles')
        .join('topics', 'articles.topic_id', '=', 'topics.topic_id')
        .join('users', 'articles.user_id', '=', 'users.user_id')
        .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
        .groupBy('articles.article_id', 'users.username', 'topics.slug')
        .as('select_articles')
        .modify(query => {
          if (username && slug) {
            query.where({ username, slug });
          } else if (username) {
            query.where({ username });
          } else if (slug) {
            query.where({ slug });
          }
        });
    });
};

exports.selectArticles = (sort_by, order, username, slug, limit, page) => {
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
    .limit(limit)
    .offset(limit * (page - 1))
    .modify(query => {
      if (username && slug) {
        query.where({ username, slug });
      } else if (username) {
        query.where({ username });
      } else if (slug) {
        query.where({ slug });
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

exports.insertArticle = (username, slug, title, body) => {
  return knex('inserted_article')
    .with(
      'inserted_article',
      knex('articles')
        .insert({
          user_id: knex('users').select('user_id').where({ username }),
          topic_id: knex('topics').select('topic_id').where({ slug }),
          title,
          body
        })
        .returning('*')
    )
    .select(
      'users.username AS author',
      'inserted_article.title',
      'inserted_article.article_id',
      'inserted_article.body',
      'topics.slug AS topic',
      'inserted_article.created_at',
      'inserted_article.updated_at',
      'inserted_article.votes'
    )
    .count('comments.comment_id', { as: 'comment_count' })
    .join('topics', 'inserted_article.topic_id', '=', 'topics.topic_id')
    .join('users', 'inserted_article.user_id', '=', 'users.user_id')
    .leftJoin(
      'comments',
      'inserted_article.article_id',
      '=',
      'comments.article_id'
    )
    .groupBy(
      'inserted_article.article_id',
      'inserted_article.title',
      'inserted_article.article_id',
      'inserted_article.body',
      'inserted_article.created_at',
      'inserted_article.updated_at',
      'inserted_article.votes',
      'users.username',
      'topics.slug'
    );
};

exports.deleteArticle = article_id => {
  return knex('articles')
    .del()
    .where({ article_id })
    .then(affectedRows => {
      return affectedRows === 0
        ? Promise.reject({ status: 404, msg: 'Article Not Found' })
        : Promise.resolve();
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return knex('updated_article')
    .with(
      'updated_article',
      knex('articles')
        .where({ article_id })
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
