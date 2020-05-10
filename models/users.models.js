const knex = require('../db/connection');

exports.selectUser = username => {
  return knex('users')
    .select(
      'username',
      'avatar_url',
      knex.raw("CONCAT(first_name, ' ', last_name) AS name")
    )
    .where({ username })
    .then(user => {
      return user.length === 0
        ? Promise.reject({ status: 404, msg: 'User Not Found' })
        : user;
    });
};
