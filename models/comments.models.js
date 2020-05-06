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
