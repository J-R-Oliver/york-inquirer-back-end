const knex = require('../db/connection');

exports.insertComment = (article_id, username, body) => {
  if (!username) {
    return Promise.reject({ status: 400, msg: 'Invalid Request Body' });
  }

  return knex('users')
    .select('user_id')
    .where('username', username)
    .then(userIdArr => {
      if (userIdArr.length === 0) {
        return Promise.reject({ status: 404, msg: 'Username Not Found' });
      }

      const [{ user_id }] = userIdArr;

      return knex('comments')
        .insert({
          article_id,
          body,
          user_id
        })
        .returning([
          'comment_id',
          knex.raw(`'${username}' AS author`),
          'body',
          'votes',
          'created_at',
          'updated_at'
        ]);
    });
};

exports.selectComments = (article_id, sort_by, order) => {
  const sortBy = sort_by || 'created_at';

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
    .where('comments.article_id', article_id)
    .orderBy(sortBy, order)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      }
      return comments;
    });
};

exports.updateComment = (comment_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: 'Invalid Request Body' });
  }

  return knex('comments')
    .where('comments.comment_id', comment_id)
    .increment('votes', inc_votes)
    .then(() => {
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
        .where('comments.comment_id', comment_id);
    })
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: 'Comment Not Found' });
      }
      return comment;
    });
};

exports.deleteComment = comment_id => {
  return knex('comments')
    .del()
    .where('comments.comment_id', comment_id)
    .then(affectedRows => {
      if (affectedRows === 0) {
        return Promise.reject({ status: 404, msg: 'Comment Not Found' });
      }
      return Promise.resolve();
    });
};
