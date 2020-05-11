const { NODE_ENV = 'development' } = process.env;

const devData = require('./development-data');
const testData = require('./test-data');

const data = {
  production: devData,
  development: devData,
  test: testData
};

module.exports = data[NODE_ENV];
