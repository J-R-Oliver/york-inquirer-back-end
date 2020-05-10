const knex = require('../db/connection');

exports.selectComments = (article_id, sort_by, order) => {
  return knex('comments')
    .select(
      'comments.comment_id',
      'users.username AS author',
      'comments.body',
      'comments.votes',
      'comments.created_at',
      'comments.updated_at'
    )
    .join('users', 'comments.user_id', '=', 'users.user_id')
    .where({ article_id })
    .orderBy(sort_by, order);
};

exports.insertComment = (article_id, username, body) => {
  return knex('comments')
    .insert({
      article_id,
      body,
      user_id: knex('users').select('user_id').where({ username })
    })
    .returning([
      'comment_id',
      knex.raw('? AS author', [username]),
      'body',
      'votes',
      'created_at',
      'updated_at'
    ]);
};

exports.deleteComment = comment_id => {
  return knex('comments')
    .del()
    .where({ comment_id })
    .then(affectedRows => {
      return affectedRows === 0
        ? Promise.reject({ status: 404, msg: 'Comment Not Found' })
        : Promise.resolve();
    });
};

exports.updateComment = (comment_id, inc_votes) => {
  return knex('updated_comment')
    .with(
      'updated_comment',
      knex('comments')
        .where({ comment_id })
        .increment('votes', inc_votes)
        .returning('*')
    )
    .select(
      'updated_comment.comment_id',
      'users.username AS author',
      'updated_comment.body',
      'updated_comment.votes',
      'updated_comment.created_at',
      'updated_comment.updated_at'
    )
    .join('users', 'updated_comment.user_id', '=', 'users.user_id')
    .then(comment => {
      return comment.length === 0
        ? Promise.reject({ status: 404, msg: 'Comment Not Found' })
        : comment;
    });
};
