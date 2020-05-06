const knex = require('../db/connection');

exports.selectUser = username => {
  return knex('users')
    .select(
      'username',
      'avatar_url',
      knex.raw("CONCAT(first_name, ' ', last_name) AS name")
    )
    .where('username', username)
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: 'User Not Found' });
      }
      return user;
    });
};
