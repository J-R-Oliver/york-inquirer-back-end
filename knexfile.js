const { DATABASE_URL, NODE_ENV = 'development' } = process.env;

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
      user: 'postgres',
      password: 'secret'
    }
  },
  test: {
    connection: {
      database: 'york_inquirer_test',
      user: 'postgres',
      password: 'secret'
    }
  }
};

module.exports = { ...customConfig[NODE_ENV], ...baseConfig };
