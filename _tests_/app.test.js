process.env.NODE_ENV = 'test';

const request = require('supertest');
const knex = require('../db/connection');
const app = require('../app');

describe('app', () => {
  beforeEach(() => knex.seed.run());

  afterAll(() => knex.destroy());

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
    });
  });
});
