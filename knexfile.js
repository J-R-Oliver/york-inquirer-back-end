// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const { DATABASE_URL, DB_USER, DB_PASSWORD, NODE_ENV } = process.env;

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  production: {
    connection: {
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  development: {
    connection: {
      database: 'york_inquirer',
      user: DB_USER,
      password: DB_PASSWORD
    }
  },
  test: {
    connection: {
      database: 'york_inquirer_test',
      user: DB_USER,
      password: DB_PASSWORD
    }
  }
};

module.exports = { ...customConfig[NODE_ENV], ...baseConfig };
