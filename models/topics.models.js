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
      return user.length === 0
        ? Promise.reject({ status: 404, msg: 'Topic Not Found' })
        : user;
    });
};

exports.insertTopic = (slug, description) => {
  return knex('topics')
    .insert({ slug, description })
    .returning(['slug', 'description']);
};
