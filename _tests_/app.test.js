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
      describe('GET', () => {
        it('status: 200 - responds with an array of articles', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeInstanceOf(Array);
              expect(body.articles).toHaveLength(12);
            });
        });

        it('status: 200 - responds with an array of article objects', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              body.articles.forEach(article => {
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('updated_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('comment_count');
              });
            });
        });

        it('status: 200 - responds with articles sorted by default, created_at and ascending', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('created_at');
            });
        });

        it('status: 200 - responds with comment_count for each article', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[11]).toHaveProperty('comment_count', '13');

              body.articles.forEach(article => {
                expect(article).toHaveProperty('comment_count');
              });
            });
        });

        it('status: 200 - responds with topic for each article', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[7]).toHaveProperty('topic', 'cats');

              body.articles.forEach(article => {
                expect(article).toHaveProperty('topic');
              });
            });
        });

        it('status: 200 - responds with oldest article first when sorted by default', () => {
          const expected = {
            author: 'butter_bridge',
            title: 'Moustache',
            article_id: 12,
            topic: 'mitch',
            created_at: '1974-11-26T12:21:54.171Z',
            updated_at: '1974-11-26T12:21:54.171Z',
            votes: 0,
            comment_count: '0'
          };

          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).toStrictEqual(expected);
            });
        });

        it('status: 200 - responds with articles sorted by sort_by query', () => {
          return request(app)
            .get('/api/articles?sort_by=votes')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('votes');
            });
        });

        it('status: 200 - responds with articles ordered by order query', () => {
          return request(app)
            .get('/api/articles?order=desc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('created_at', {
                descending: true
              });
            });
        });

        it('status: 200 - responds with articles whose author matches username query', () => {
          return request(app)
            .get('/api/articles?username=rogersop')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toHaveLength(3);

              body.articles.forEach(article => {
                expect(article).toHaveProperty('author', 'rogersop');
              });
            });
        });

        it('status: 200 - responds with articles whose topic matches topic query', () => {
          return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toHaveLength(11);

              body.articles.forEach(article => {
                expect(article).toHaveProperty('topic', 'mitch');
              });
            });
        });

        it('status: 200 - responds with articles who are sorted and ordered by query, and filtered by username and topic query', () => {
          const expected = {
            author: 'rogersop',
            title: 'UNCOVERED: catspiracy to bring down democracy',
            article_id: 5,
            topic: 'cats',
            created_at: '2002-11-19T12:21:54.171Z',
            updated_at: '2002-11-19T12:21:54.171Z',
            votes: 0,
            comment_count: '2'
          };

          return request(app)
            .get(
              '/api/articles?sort_by=votes&order=desc&username=rogersop&topic=cats'
            )
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toHaveLength(1);
              expect(body.articles[0]).toStrictEqual(expected);
            });
        });

        it('status: 400 - responds with Invalid Request Query when passed an invalid query', () => {
          return request(app)
            .get('/api/articles?cats=great')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Invalid Request Query');
            });
        });

        it('status: 400 - responds with Invalid Request Query when passed an invalid query argument', () => {
          return request(app)
            .get('/api/articles?sort_by=cats')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Invalid Request Query');
            });
        });

        it('status: 404 - responds with Articles Not Found when no articles match query', () => {
          return request(app)
            .get('/api/articles?topic=dog')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Articles Not Found');
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
              [method]('/api/articles')
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).toBe('Method Not Allowed');
              });
          });

          return Promise.all(requestPromises);
        });
      });

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

          it('status: 200 - responds with update_at to current time', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article.updated_at).not.toBe(
                  body.article.created_at
                );
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
                [method]('/api/articles/1')
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).toBe('Method Not Allowed');
                });
            });

            return Promise.all(requestPromises);
          });
        });

        describe('/comments', () => {
          describe('GET', () => {
            it('status: 200 - responds with array of comments', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeInstanceOf(Array);
                  expect(body.comments).toHaveLength(13);
                });
            });

            it('status: 200 - responds with comment_id, author, body, votes, created_at and updated_at for each comment', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  body.comments.forEach(comment => {
                    expect(comment).toHaveProperty('comment_id');
                    expect(comment).toHaveProperty('author');
                    expect(comment).toHaveProperty('body');
                    expect(comment).toHaveProperty('votes');
                    expect(comment).toHaveProperty('created_at');
                    expect(comment).toHaveProperty('updated_at');
                  });
                });
            });

            it('status: 200 - responds with comments sorted by default, created_at and ascending', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('created_at');
                });
            });

            it('status: 200 - responds with oldest comment first when sorted by default', () => {
              const expected = {
                comment_id: 18,
                votes: 16,
                created_at: '2000-11-26T12:36:03.389Z',
                updated_at: '2000-11-26T12:36:03.389Z',
                author: 'butter_bridge',
                body: 'This morning, I showered for nine minutes.'
              };

              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments[0]).toStrictEqual(expected);
                });
            });

            it('status: 200 - responds with comments sorted by query', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=votes')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('votes');
                });
            });

            it('status: 200 - responds with comments sorted in query order', () => {
              return request(app)
                .get('/api/articles/1/comments?order=desc')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('created_at', {
                    descending: true
                  });
                });
            });

            it('status: 200 - responds with comments sorted and ordered by query', () => {
              return request(app)
                .get('/api/articles/1/comments?order=desc&sort_by=updated_at')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('updated_at', {
                    descending: true
                  });
                });
            });

            it('status: 400 - responds with Invalid Request Query when passed an invalid sort by query', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=cats')
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).toBe('Invalid Request Query');
                });
            });

            it('status: 404 - responds with Article Not Found when id does not exist', () => {
              return request(app)
                .get('/api/articles/100/comments')
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).toBe('Article Not Found');
                });
            });
          });

          describe('POST', () => {
            it('status: 201 - responds with a comment object', () => {
              return request(app)
                .post('/api/articles/4/comments')
                .send({
                  username: 'butter_bridge',
                  body: 'Test comment about cats'
                })
                .expect(201)
                .then(({ body }) => {
                  expect(body.comment).toHaveProperty('comment_id');
                  expect(body.comment).toHaveProperty('author');
                  expect(body.comment).toHaveProperty('body');
                  expect(body.comment).toHaveProperty('votes');
                  expect(body.comment).toHaveProperty('created_at');
                  expect(body.comment).toHaveProperty('updated_at');
                });
            });

            it('status: 201 - responds with the posted comment object', () => {
              return request(app)
                .post('/api/articles/3/comments')
                .send({ username: 'icellusedkars', body: 'I love cats also' })
                .expect(201)
                .then(({ body }) => {
                  expect(body.comment).toHaveProperty('comment_id', 19);
                  expect(body.comment).toHaveProperty(
                    'author',
                    'icellusedkars'
                  );
                  expect(body.comment).toHaveProperty(
                    'body',
                    'I love cats also'
                  );
                });
            });

            it('status: 201 - responds with votes defaulted to 0', () => {
              return request(app)
                .post('/api/articles/2/comments')
                .send({ username: 'rogersop', body: 'Also love cats' })
                .expect(201)
                .then(({ body }) => {
                  expect(body.comment).toHaveProperty('votes', 0);
                });
            });

            it('status: 201 - responds with created_at and update_at not set to null', () => {
              return request(app)
                .post('/api/articles/2/comments')
                .send({ username: 'rogersop', body: 'Also love cats' })
                .expect(201)
                .then(({ body }) => {
                  expect(body.comment.created_at).toBeTruthy;
                  expect(body.comment.updated_at).toBeTruthy;
                });
            });

            it('status: 400 - responds with Invalid Request Body when passed invalid body', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ id: 'lurker', comment: 'I dont like cats' })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).toBe('Invalid Request Body');
                });
            });

            it('status: 404 - responds with Username Not Found when passed an unknown username', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'dog', body: 'I dont like cats' })
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).toBe('Username Not Found');
                });
            });

            it('status: 404 - responds with Article Not Found when id does not exist', () => {
              return request(app)
                .post('/api/articles/100/comments')
                .send({ username: 'butter_bridge', body: 'We all love cats' })
                .then(({ body }) => {
                  expect(body.msg).toBe('Article Not Found');
                });
            });
          });

          describe('unsupported methods', () => {
            it('status: 405 - responds with Method Not Allowed', () => {
              const methods = ['patch', 'put', 'delete', 'options', 'trace'];

              const requestPromises = methods.map(method => {
                return request(app)
                  [method]('/api/articles/1/comments')
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
