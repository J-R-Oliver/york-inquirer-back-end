// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const { NODE_ENV, DATABASE_URL } = process.env;

const dbConfig =
  NODE_ENV === 'production'
    ? { client: 'pg', connection: DATABASE_URL }
    : require('../knexfile');

module.exports = require('knex')(dbConfig);
