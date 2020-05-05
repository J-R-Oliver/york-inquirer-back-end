process.env.NODE_ENV = 'test';

const request = require('supertest');
const knex = require('../db/connection');
const app = require('../app');

describe('app', () => {
  beforeEach(() => knex.seed.run());

  afterAll(() => knex.destroy());

  test('status:404 - unsupported routes respond with Not Found', () => {
    return request(app)
      .get('/cats')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });

  describe('/api', () => {
    describe('/topics', () => {
      describe('GET', () => {
        it('status: 200 - responds with array of topics', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).toBeInstanceOf(Array);
              expect(body.topics).toHaveLength(3);
            });
        });

        it('status: 200 - each topic to have description and slug keys', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              body.topics.forEach(topic => {
                expect(topic).toHaveProperty('description');
                expect(topic).toHaveProperty('slug');
              });
            });
        });

        it('status: 200 - topics to come back sorted alphabetically by slug', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).toBeSortedBy('slug');
            });
        });
      });

      describe('unsupported methods', () => {
        it('status: 405 - responds with Method Not Allowed', () => {
          const methods = [
            'post',
            'put',
            'delete',
            'options',
            'trace',
            'patch'
          ];

          const requestPromises = methods.map(method => {
            return request(app)
              [method]('/api/topics')
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).toBe('Method Not Allowed');
              });
          });

          return Promise.all(requestPromises);
        });
      });
    });
  });
});
