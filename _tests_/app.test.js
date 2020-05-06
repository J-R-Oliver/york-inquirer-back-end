process.env.NODE_ENV = 'test';

const request = require('supertest');
const knex = require('../db/connection');
const app = require('../app');

describe('app', () => {
  beforeEach(() => knex.seed.run());

  afterAll(() => knex.destroy());

  it('status:404 - responds with Not Found on unsupported routes', () => {
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

        it('status: 200 - responds with description and slug keys for each topic', () => {
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

        it('status: 200 - responds with topics sorted alphabetically by slug', () => {
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
        describe('GET', () => {
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

          it('status: 400 - responds with Invalid Request when :article_id is not an number', () => {
            return request(app)
              .get('/api/articles/cats')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid Request');
              });
          });

          it('status: 404 - responds with Article Not Found when id does not exist', () => {
            return request(app)
              .get('/api/articles/100')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Article Not Found');
              });
          });
        });

        describe('PATCH', () => {
          it('status: 200 - responds with an article object', () => {
            return request(app)
              .patch('/api/articles/4')
              .send({ inc_votes: 1 })
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

          it('status: 200 - responds with votes incremented by 66', () => {
            return request(app)
              .patch('/api/articles/3')
              .send({ inc_votes: 66 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article).toHaveProperty('votes', 66);
              });
          });

          it('status: 200 - responds with votes decremented by 99', () => {
            return request(app)
              .patch('/api/articles/2')
              .send({ inc_votes: -99 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article).toHaveProperty('votes', -99);
              });
          });

          it('status: 400 - responds with Invalid Request when inc_votes is not an number', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({ inc_votes: 'cats' })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid Request');
              });
          });

          it('status: 400 - responds with Invalid Request Body when passed invalid key', () => {
            return request(app)
              .patch('/api/articles/1')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid Request Body');
              });
          });

          it('status: 404 - responds with Article Not Found when id does not exist', () => {
            return request(app)
              .patch('/api/articles/100')
              .send({ inc_votes: 1 })
              .then(({ body }) => {
                expect(body.msg).toBe('Article Not Found');
              });
          });
        });

        describe('unsupported methods', () => {
          it('status: 405 - responds with Method Not Allowed', () => {
            const methods = ['post', 'put', 'delete', 'options', 'trace'];

            const requestPromises = methods.map(method => {
              return request(app)
                [method]('/api/articles/:article_id')
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

    describe('/users', () => {
      describe('/:username', () => {
        describe('GET', () => {
          it('status: 200 - responds with an user object', () => {
            return request(app)
              .get('/api/users/butter_bridge')
              .expect(200)
              .then(({ body }) => {
                expect(body.user).toHaveProperty('username');
                expect(body.user).toHaveProperty('avatar_url');
              });
          });

          it('status: 200 - responds with first name and last name combined in name key', () => {
            return request(app)
              .get('/api/users/icellusedkars')
              .expect(200)
              .then(({ body }) => {
                expect(body.user).toHaveProperty('name', 'sam samson');
              });
          });

          it('status: 200 - responds with user object with username of rogersop', () => {
            return request(app)
              .get('/api/users/rogersop')
              .expect(200)
              .then(({ body }) => {
                expect(body.user).toHaveProperty('username', 'rogersop');
                expect(body.user).toHaveProperty(
                  'avatar_url',
                  'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                );
                expect(body.user).toHaveProperty('name', 'paul paulson');
              });
          });

          it('status: 404 - responds with User Not Found when username does not exist', () => {
            return request(app)
              .get('/api/users/smurf66')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('User Not Found');
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
                [method]('/api/users/:username')
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
});
