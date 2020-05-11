process.env.NODE_ENV = 'test';

const request = require('supertest');
const knex = require('../db/connection');
const app = require('../app');

describe('app', () => {
  beforeEach(() => knex.seed.run());

  afterAll(() => knex.destroy());

  describe('Unsupported routes', () => {
    it('status: 404 - responds with Not Found on unsupported routes', () => {
      return request(app)
        .get('/cats')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
  });

  describe('/api', () => {
    describe('GET', () => {
      it('status: 200 - responds with endpoint information object', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then(({ body }) => {
            expect(body['GET /api']).toHaveProperty(
              'description',
              'serves a json representation of all available endpoints'
            );
          });
      });

      it('status: 200 - responds with information detailing endpoint URL, description, queries and example response', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then(({ body }) => {
            expect(body['GET /api/articles']).toHaveProperty(
              'description',
              'serves an array of all articles'
            );
            expect(body['GET /api/articles']).toHaveProperty('queries', [
              'author',
              'order',
              'sort_by',
              'topic'
            ]);
            expect(body['GET /api/articles']).toHaveProperty([
              'exampleResponse',
              'articles'
            ]);
          });
      });
    });

    describe('unsupported methods', () => {
      it('status: 405 - responds with Method Not Allowed', () => {
        const methods = ['post', 'put', 'delete', 'options', 'trace', 'patch'];

        const requestPromises = methods.map(method => {
          return request(app)
            [method]('/api')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method Not Allowed');
            });
        });

        return Promise.all(requestPromises);
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
            });
        });

        it('status: 200 - responds with all articles', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
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

        it('status: 200 - responds with articles sorted by default, created_at and descending', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('created_at', {
                descending: true
              });
            });
        });

        it('status: 200 - responds with comment_count for each article', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).toHaveProperty('comment_count', '13');

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
              expect(body.articles[4]).toHaveProperty('topic', 'cats');

              body.articles.forEach(article => {
                expect(article).toHaveProperty('topic');
              });
            });
        });

        it('status: 200 - responds with oldest article first when sorted by default', () => {
          const expected = {
            author: 'butter_bridge',
            title: 'Living in the shadow of a great man',
            article_id: 1,
            topic: 'mitch',
            created_at: '2018-11-15T12:21:54.171Z',
            updated_at: '2018-11-15T12:21:54.171Z',
            votes: 100,
            comment_count: '13'
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
              expect(body.articles).toBeSortedBy('votes', { descending: true });
            });
        });

        it('status: 200 - responds with articles ordered by order query', () => {
          return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('created_at');
            });
        });

        it('status: 200 - responds with articles whose author matches author query', () => {
          return request(app)
            .get('/api/articles?author=rogersop')
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

        it('status: 200 - responds with articles who are sorted and ordered by query, and filtered by author and topic query', () => {
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
              '/api/articles?sort_by=votes&order=asc&author=rogersop&topic=cats'
            )
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toHaveLength(1);
              expect(body.articles[0]).toStrictEqual(expected);
            });
        });

        it('status: 200 - responds with empty array when no articles match query arguments', () => {
          return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeInstanceOf(Array);
              expect(body.articles).toHaveLength(0);
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

        it('status: 404 - responds with User Not Found when passed a username that does not exist as argument in query', () => {
          return request(app)
            .get('/api/articles?author=doesnotexist')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('User Not Found');
            });
        });

        it('status: 404 - responds with Topic Not Found when passed a topic that does not exist as argument in query', () => {
          return request(app)
            .get('/api/articles?topic=dogs')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Topic Not Found');
            });
        });
      });

      describe('POST', () => {
        it('status: 201 - responds with an article object', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('author');
              expect(body.article).toHaveProperty('title');
              expect(body.article).toHaveProperty('article_id');
              expect(body.article).toHaveProperty('body');
              expect(body.article).toHaveProperty('topic');
              expect(body.article).toHaveProperty('created_at');
              expect(body.article).toHaveProperty('updated_at');
              expect(body.article).toHaveProperty('votes');
              expect(body.article).toHaveProperty('comment_count');
            });
        });

        it('status: 201 - responds with votes defaulted to 0', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('votes', 0);
            });
        });

        it('status: 201 - responds with comment_count defaulted to 0', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('comment_count', '0');
            });
        });

        it('status: 201 - responds with created_at and update_at not set to null', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.article.updated_at).toBeTruthy();
              expect(body.article.created_at).toBeTruthy();
            });
        });

        it('status: 201 - responds with author based on request username', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('author', 'butter_bridge');
            });
        });

        it('status: 201 - responds with article_id', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('article_id', 13);
            });
        });

        it('status: 201 - responds with topic', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('topic', 'cats');
            });
        });

        it('status: 201 - responds with the posted article object', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.article).toHaveProperty('author', 'butter_bridge');
              expect(body.article).toHaveProperty('title', 'My test article');
              expect(body.article).toHaveProperty('article_id', 13);
              expect(body.article).toHaveProperty(
                'body',
                'Test article about cats'
              );
              expect(body.article).toHaveProperty('topic', 'cats');
              expect(body.article).toHaveProperty('created_at');
              expect(body.article).toHaveProperty('updated_at');
              expect(body.article).toHaveProperty('votes', 0);
              expect(body.article).toHaveProperty('comment_count', '0');
            });
        });

        it('status: 400 - responds with Invalid Request Body when passed invalid body', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Invalid Request Body');
            });
        });

        it('status: 404 - responds with User Not Found when passed a non-existent username', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'unknown_user',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'cats'
            })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('User Not Found');
            });
        });

        it('status: 404 - responds with Topic Not Found when passed a non-existent topic', () => {
          return request(app)
            .post('/api/articles')
            .send({
              username: 'butter_bridge',
              title: 'My test article',
              body: 'Test article about cats',
              topic: 'unknown topic'
            })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Topic Not Found');
            });
        });
      });

      describe('unsupported methods', () => {
        it('status: 405 - responds with Method Not Allowed', () => {
          const methods = ['put', 'delete', 'options', 'trace', 'patch'];

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

        describe('DELETE', () => {
          // eslint-disable-next-line jest/expect-expect
          it('status: 204 - responds with no content', () => {
            return request(app).del('/api/articles/4').expect(204);
          });

          it('status: 400 - responds with Invalid Request when :article_id is not an number', () => {
            return request(app)
              .del('/api/articles/cat')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid Request');
              });
          });

          it('status: 404 - responds with Article Not Found when id does not exist', () => {
            return request(app)
              .del('/api/articles/66')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Article Not Found');
              });
          });

          it('status: 404 - responds with Article Not Found following delete request', () => {
            return request(app)
              .del('/api/articles/4')
              .then(() => {
                return request(app)
                  .get('/api/articles/4')
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).toBe('Article Not Found');
                  });
              });
          });

          it('status: 404 - responds with Comment Not Found following delete request', () => {
            return request(app)
              .del('/api/articles/1')
              .then(() => {
                return request(app)
                  .del('/api/comments/2')
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).toBe('Comment Not Found');
                  });
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
              .patch('/api/articles/1')
              .send({ inc_votes: 66 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article).toHaveProperty('votes', 166);
              });
          });

          it('status: 200 - responds with votes decremented by 101', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({ inc_votes: -101 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article).toHaveProperty('votes', -1);
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

          it('status: 200 - responds with article 11 with votes updated', () => {
            return request(app)
              .patch('/api/articles/11')
              .send({ inc_votes: 15 })
              .expect(200)
              .then(({ body }) => {
                expect(body.article).toHaveProperty('author', 'icellusedkars');
                expect(body.article).toHaveProperty('title', 'Am I a cat?');
                expect(body.article).toHaveProperty('article_id', 11);
                expect(body.article).toHaveProperty(
                  'body',
                  'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?'
                );
                expect(body.article).toHaveProperty('topic', 'mitch');
                expect(body.article).toHaveProperty(
                  'created_at',
                  '1978-11-25T12:21:54.171Z'
                );
                expect(body.article).toHaveProperty('updated_at');
                expect(body.article).toHaveProperty('votes', 15);
                expect(body.article).toHaveProperty('comment_count', '0');
              });
          });

          it('status: 200 - responds with article object unchanged when request body is made without inc_votes', () => {
            return request(app)
              .patch('/api/articles/11')
              .expect(200)
              .then(({ body }) => {
                expect(body.article).toHaveProperty('author', 'icellusedkars');
                expect(body.article).toHaveProperty('title', 'Am I a cat?');
                expect(body.article).toHaveProperty('article_id', 11);
                expect(body.article).toHaveProperty(
                  'body',
                  'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?'
                );
                expect(body.article).toHaveProperty('topic', 'mitch');
                expect(body.article).toHaveProperty(
                  'created_at',
                  '1978-11-25T12:21:54.171Z'
                );
                expect(body.article).toHaveProperty('updated_at');
                expect(body.article).toHaveProperty('votes', 0);
                expect(body.article).toHaveProperty('comment_count', '0');
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
            const methods = ['post', 'put', 'options', 'trace'];

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
                });
            });

            it('status: 200 - responds with all comments for article id', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toHaveLength(13);
                });
            });

            it('status: 200 - responds with an array of comment objects', () => {
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

            it('status: 200 - responds with comments sorted by default, created_at and descending', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('created_at', {
                    descending: true
                  });
                });
            });

            it('status: 200 - responds with newest comment first when sorted by default', () => {
              const expected = {
                comment_id: 2,
                votes: 14,
                created_at: '2016-11-22T12:36:03.389Z',
                updated_at: '2016-11-22T12:36:03.389Z',
                author: 'butter_bridge',
                body:
                  'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
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
                  expect(body.comments).toBeSortedBy('votes', {
                    descending: true
                  });
                });
            });

            it('status: 200 - responds with comments sorted in query order', () => {
              return request(app)
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('created_at');
                });
            });

            it('status: 200 - responds with comments sorted and ordered by query', () => {
              return request(app)
                .get('/api/articles/1/comments?order=asc&sort_by=updated_at')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeSortedBy('updated_at');
                });
            });

            it('status: 200 - responds with empty array when no comments exist for article id', () => {
              return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).toBeInstanceOf(Array);
                  expect(body.comments).toHaveLength(0);
                });
            });

            it('status: 400 - responds with Invalid Request Query when passed an invalid query', () => {
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
                  expect(body.comment.created_at).toBeTruthy();
                  expect(body.comment.updated_at).toBeTruthy();
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

            it('status: 400 - responds with Invalid Request Body when passed invalid body', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'icellusedkars' })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).toBe('Invalid Request Body');
                });
            });

            it('status: 404 - responds with User Not Found when passed an unknown username', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'dog', body: 'I dont like cats' })
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).toBe('User Not Found');
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
              const methods = ['put', 'delete', 'options', 'trace', 'patch'];

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

    describe('/comments', () => {
      describe('/:comment_id', () => {
        describe('DELETE', () => {
          // eslint-disable-next-line jest/expect-expect
          it('status: 204 - responds with no content', () => {
            return request(app).del('/api/comments/1').expect(204);
          });

          it('status: 400 responds with Invalid Request when :comment_id is not an number', () => {
            return request(app)
              .del('/api/comments/cat')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid Request');
              });
          });

          it('status: 404 responds with Comment Not Found when id does not exist', () => {
            return request(app)
              .del('/api/comments/66')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Comment Not Found');
              });
          });
        });

        describe('PATCH', () => {
          it('status: 200 - responds with a comment object', () => {
            return request(app)
              .patch('/api/comments/4')
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body }) => {
                expect(body.comment).toHaveProperty('comment_id');
                expect(body.comment).toHaveProperty('author');
                expect(body.comment).toHaveProperty('body');
                expect(body.comment).toHaveProperty('votes');
                expect(body.comment).toHaveProperty('created_at');
                expect(body.comment).toHaveProperty('updated_at');
              });
          });

          it('status: 200 - responds with votes incremented by 6', () => {
            return request(app)
              .patch('/api/comments/2')
              .send({ inc_votes: 6 })
              .expect(200)
              .then(({ body }) => {
                expect(body.comment).toHaveProperty('votes', 20);
              });
          });

          it('status: 200 - responds with votes decremented by 9', () => {
            return request(app)
              .patch('/api/comments/3')
              .send({ inc_votes: -9 })
              .expect(200)
              .then(({ body }) => {
                expect(body.comment).toHaveProperty('votes', 91);
              });
          });

          it('status: 200 - responds with update_at to current time', () => {
            return request(app)
              .patch('/api/comments/4')
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body }) => {
                expect(body.comment.updated_at).not.toBe(
                  body.comment.created_at
                );
              });
          });

          it('status: 200 - responds with a comment object matching parameter id', () => {
            return request(app)
              .patch('/api/comments/1')
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body }) => {
                expect(body.comment).toHaveProperty('comment_id', 1);
                expect(body.comment).toHaveProperty('author', 'butter_bridge');
                expect(body.comment).toHaveProperty(
                  'body',
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                );
                expect(body.comment).toHaveProperty('votes', 17);
              });
          });

          it('status: 200 - responds with unchanged article when body is missing inc_votes', () => {
            return request(app)
              .patch('/api/comments/1')
              .expect(200)
              .then(({ body }) => {
                expect(body.comment).toHaveProperty('comment_id', 1);
                expect(body.comment).toHaveProperty('author', 'butter_bridge');
                expect(body.comment).toHaveProperty(
                  'body',
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                );
                expect(body.comment).toHaveProperty('votes', 16);
              });
          });

          it('status: 400 - responds with Invalid Request when inc_votes is not an number', () => {
            return request(app)
              .patch('/api/comments/5')
              .send({ inc_votes: 'cats' })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Invalid Request');
              });
          });

          it('status: 404 - responds with Comment Not Found when id does not exist', () => {
            return request(app)
              .patch('/api/comments/100')
              .send({ inc_votes: 1 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Comment Not Found');
              });
          });
        });

        describe('unsupported methods', () => {
          it('status: 405 - responds with Method Not Allowed', () => {
            const methods = ['get', 'post', 'put', 'options', 'trace'];

            const requestPromises = methods.map(method => {
              return request(app)
                [method]('/api/comments/1')
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

    describe('/topics', () => {
      describe('GET', () => {
        it('status: 200 - responds with array of topics', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).toBeInstanceOf(Array);
            });
        });

        it('status: 200 - responds with all topics', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).toHaveLength(3);
            });
        });

        it('status: 200 - responds with an array of topic objects', () => {
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

        it('status: 200 - responds with first optic in alphabetical order', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              expect(body.topics[0]).toHaveProperty('description', 'Not dogs');
              expect(body.topics[0]).toHaveProperty('slug', 'cats');
            });
        });
      });

      describe('POST', () => {
        it('status: 201 - responds with a topic object', () => {
          return request(app)
            .post('/api/topics')
            .send({
              slug: 'Lemons',
              description: 'When life gives you lemons...'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.topic).toHaveProperty('description');
              expect(body.topic).toHaveProperty('slug');
            });
        });

        it('status: 201 - responds with the posted user object', () => {
          return request(app)
            .post('/api/topics')
            .send({
              slug: 'Chocolate',
              description: 'Better than...'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.topic).toHaveProperty(
                'description',
                'Better than...'
              );
              expect(body.topic).toHaveProperty('slug', 'Chocolate');
            });
        });

        it('status: 400 - responds with Invalid Request Body when passed invalid body', () => {
          return request(app)
            .post('/api/topics')
            .send({
              description: 'Better than...'
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Invalid Request Body');
            });
        });
      });

      describe('unsupported methods', () => {
        it('status: 405 - responds with Method Not Allowed', () => {
          const methods = ['put', 'delete', 'options', 'trace', 'patch'];

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

    describe('/users', () => {
      describe('GET', () => {
        it('status: 200 - responds with array of users', () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              expect(body.users).toBeInstanceOf(Array);
            });
        });

        it('status: 200 - responds with all users', () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              expect(body.users).toHaveLength(4);
            });
        });

        it('status: 200 - responds with total_votes for each user defaulting to 0', () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              expect(body.users[3]).toHaveProperty('total_votes', '0');

              body.users.forEach(user => {
                expect(user).toHaveProperty('total_votes');
              });
            });
        });

        it('status: 200 - responds with first_name and last_name as name for each user', () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              expect(body.users[3]).toHaveProperty('name', 'paul paulson');

              body.users.forEach(user => {
                expect(user).toHaveProperty('name');
              });
            });
        });

        it('status: 200 - responds with array of user objects', () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              body.users.forEach(user => {
                expect(user).toHaveProperty('username');
                expect(user).toHaveProperty('avatar_url');
              });
            });
        });

        it('status: 200 - responds with users sorted by total_votes', () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              expect(body.users).toBeSortedBy('total_votes', {
                descending: true
              });
            });
        });

        it('status: 200 - responds with user with highest votes first', () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              expect(body.users[0]).toHaveProperty('username', 'butter_bridge');
              expect(body.users[0]).toHaveProperty(
                'avatar_url',
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
              );
              expect(body.users[0]).toHaveProperty('name', 'jonny jim');
              expect(body.users[0]).toHaveProperty('total_votes', '644');
            });
        });
      });

      describe('POST', () => {
        it('status: 201 - responds with a user object', () => {
          return request(app)
            .post('/api/users')
            .send({
              username: 'cat_lover',
              avatar_url: 'https://www.testlink.co.uk',
              first_name: 'Kate',
              last_name: 'Dave'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.user).toHaveProperty('username');
              expect(body.user).toHaveProperty('avatar_url');
              expect(body.user).toHaveProperty('name');
              expect(body.user).toHaveProperty('total_votes');
            });
        });

        it('status: 201 - responds with total_votes defaulted to 0', () => {
          return request(app)
            .post('/api/users')
            .send({
              username: 'cat_lover',
              avatar_url: 'https://www.testlink.co.uk',
              first_name: 'Kate',
              last_name: 'Dave'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.user).toHaveProperty('total_votes', '0');
            });
        });

        it('status: 201 - responds with the posted user object', () => {
          return request(app)
            .post('/api/users')
            .send({
              username: 'cat_lover',
              avatar_url: 'https://www.testlink.co.uk',
              first_name: 'Kate',
              last_name: 'Dave'
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.user).toHaveProperty('username', 'cat_lover');
              expect(body.user).toHaveProperty(
                'avatar_url',
                'https://www.testlink.co.uk'
              );
              expect(body.user).toHaveProperty('name', 'Kate Dave');
            });
        });

        it('status: 400 - responds with Invalid Request Body when passed invalid body', () => {
          return request(app)
            .post('/api/users')
            .send({
              avatar_url: 'https://www.testlink.co.uk',
              first_name: 'Kate',
              last_name: 'Dave'
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Invalid Request Body');
            });
        });
      });

      describe('unsupported methods', () => {
        it('status: 405 - responds with Method Not Allowed', () => {
          const methods = ['put', 'delete', 'options', 'trace', 'patch'];

          const requestPromises = methods.map(method => {
            return request(app)
              [method]('/api/users')
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).toBe('Method Not Allowed');
              });
          });

          return Promise.all(requestPromises);
        });
      });

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

          it('status: 200 - responds with total_votes for user', () => {
            return request(app)
              .get('/api/users/butter_bridge')
              .expect(200)
              .then(({ body }) => {
                expect(body.user).toHaveProperty('total_votes', '644');
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
                expect(body.user).toHaveProperty('total_votes', '0');
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
