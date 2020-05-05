process.env.NODE_ENV = 'test';

const request = require('supertest');
const knex = require('../db/connection');
const app = require('../app');

describe('app', () => {
  beforeEach(() => knex.seed.run());

  afterAll(() => knex.destroy());

  it('status:404 - unsupported routes respond with Not Found', () => {
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

    describe('/articles', () => {
      describe('/:article_id', () => {
        it('status: 200 - responds with an article object', () => {
          return request(app)
            .get('/api/articles/4')
            .expect(200)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('author');
              expect(body.article).toHaveProperty('title');
              expect(body.article).toHaveProperty('article_id');
              expect(body.article).toHaveProperty('body');
              expect(body.article).toHaveProperty('created_at');
              expect(body.article).toHaveProperty('updated_at');
              expect(body.article).toHaveProperty('votes');
            });
        });

        it('status: 200 - responds with topic slug for article 3', () => {
          return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('topic', 'mitch');
            });
        });

        it('status: 200 - responds with a comment_count for article 6', () => {
          return request(app)
            .get('/api/articles/6')
            .expect(200)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('comment_count', '1');
            });
        });

        it('status: 200 - responds with an article object with id 1', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              const expected = {
                author: 'butter_bridge',
                title: 'Living in the shadow of a great man',
                article_id: 1,
                body: 'I find this existence challenging',
                topic: 'mitch',
                created_at: '2018-11-15T12:21:54.171Z',
                updated_at: '2018-11-15T12:21:54.171Z',
                votes: 100,
                comment_count: '13'
              };

              expect(body.article).toStrictEqual(expected);
            });
        });
      });
    });
  });
});
