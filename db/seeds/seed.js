const { topics, users, articles, comments } = require('../data/index.js');
const {
  formatUsers,
  createRefObj,
  formatArticles,
  formatComments
} = require('../seed-utils/utils');

const formattedUsers = formatUsers(users);

exports.seed = knex => {
  const topicsUsersPromiseArr = [
    knex('topics').insert(topics).returning('*'),
    knex('users').insert(formattedUsers).returning('*')
  ];

  return Promise.all(topicsUsersPromiseArr)
    .then(([topicsResult, usersResult]) => {
      const topicsRefObj = createRefObj(topicsResult, 'slug', 'topic_id');
      const usersRefObj = createRefObj(usersResult, 'username', 'user_id');

      const formattedArticles = formatArticles(
        articles,
        topicsRefObj,
        usersRefObj
      );

      const articlesUserRefPromiseArr = [
        knex('articles').insert(formattedArticles).returning('*'),
        usersRefObj
      ];

      return Promise.all(articlesUserRefPromiseArr);
    })
    .then(([articlesResult, usersRefObj]) => {
      const articleRefObj = createRefObj(articlesResult, 'title', 'article_id');

      const formattedComments = formatComments(
        comments,
        articleRefObj,
        usersRefObj
      );

      return knex('comments').insert(formattedComments);
    });
};
