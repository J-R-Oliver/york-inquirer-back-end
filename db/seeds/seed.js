const { topics } = require('../data/index.js');

exports.seed = knex => {
  return knex('topics').insert(topics);
};
