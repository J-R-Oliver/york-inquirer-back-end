const knex = require('../db/connection');

exports.selectTopics = () => {
  return knex('topics').select('slug', 'description').orderBy('slug');
};

exports.selectTopic = topicSlug => {
  return knex('topics')
    .select('slug', 'description')
    .where({ 'topics.slug': topicSlug })
    .orderBy('slug')
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: 'Topic Not Found' });
      }
      return user;
    });
};
