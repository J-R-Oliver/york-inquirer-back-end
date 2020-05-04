const { topics, users } = require('../data/index.js');
const { formatUsers } = require('../seed-utils/utils');

const formattedUsers = formatUsers(users);

exports.seed = knex => {
  const promiseArr = [
    knex('topics').insert(topics),
    knex('users').insert(formattedUsers)
  ];

  return Promise.all(promiseArr);
};
