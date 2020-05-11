const { NODE_ENV = 'development', DATABASE_URL } = process.env;

const dbConfig =
  NODE_ENV === 'production'
    ? { client: 'pg', connection: DATABASE_URL }
    : require('../knexfile');

module.exports = require('knex')(dbConfig);
