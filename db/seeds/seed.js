const { topics, users, articles } = require('../data/index.js');
const {
  formatUsers,
  createRefObj,
  formatArticles
} = require('../seed-utils/utils');

const formattedUsers = formatUsers(users);

exports.seed = knex => {
  const promiseArr = [
    knex('topics').insert(topics).returning('*'),
    knex('users').insert(formattedUsers).returning('*')
  ];

  return Promise.all(promiseArr).then(([topicsResult, usersResult]) => {
    const topicsRefObj = createRefObj(topicsResult, 'slug', 'topic_id');
    const usersRefObj = createRefObj(usersResult, 'username', 'user_id');

    const formattedArticles = formatArticles(
      articles,
      topicsRefObj,
      usersRefObj
    );

    return knex('articles').insert(formattedArticles).returning('*');
  });
};
