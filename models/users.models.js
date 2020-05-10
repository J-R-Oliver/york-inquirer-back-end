const knex = require('../db/connection');

exports.selectUsers = () => {
  return knex('users')
    .select(
      'users.username',
      'users.avatar_url',
      knex.raw("CONCAT(first_name, ' ', last_name) AS name"),
      knex.raw(
        'COALESCE(SUM(articles.votes) + SUM(comments.votes), 0) AS total_votes'
      )
    )
    .leftJoin('articles', 'users.user_id', '=', 'articles.user_id')
    .leftJoin('comments', 'users.user_id', '=', 'comments.user_id')
    .groupBy('users.user_id')
    .orderBy('total_votes', 'desc');
};

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

exports.insertUser = (username, avatar_url, first_name, last_name) => {
  return knex('insertedUser')
    .with(
      'insertedUser',
      knex('users')
        .insert({
          username,
          avatar_url,
          first_name,
          last_name
        })
        .returning([
          'users.user_id',
          'users.username',
          'users.avatar_url',
          knex.raw("CONCAT(first_name, ' ', last_name) AS name")
        ])
    )
    .select(
      'insertedUser.username',
      'insertedUser.avatar_url',
      'insertedUser.name',
      knex.raw(
        'COALESCE(SUM(articles.votes) + SUM(comments.votes), 0) AS total_votes'
      )
    )
    .leftJoin('articles', 'insertedUser.user_id', '=', 'articles.user_id')
    .leftJoin('comments', 'insertedUser.user_id', '=', 'comments.user_id')
    .groupBy(
      'insertedUser.user_id',
      'insertedUser.username',
      'insertedUser.avatar_url',
      'insertedUser.name'
    );
};
