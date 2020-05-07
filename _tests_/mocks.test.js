process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const { selectTopics } = require('../models/topics.models');

jest.mock('../models/topics.models');

test('status: 500 - responds with Internal Server Error when an unhandled error is encountered', () => {
  selectTopics.mockImplementation(() => {
    throw new Error('Mock Error');
  });

  return request(app)
    .get('/api/topics')
    .expect(500)
    .then(({ body }) => {
      expect(selectTopics).toHaveBeenCalled();
      expect(body.msg).toBe('Internal Server Error');
    });
});
