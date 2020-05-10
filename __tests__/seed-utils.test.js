const {
  formatUsers,
  createRefObj,
  formatArticles,
  formatComments
} = require('../db/seed-utils/utils');

describe('formatUsers', () => {
  it('should return an array', () => {
    expect(formatUsers([])).toBeInstanceOf(Array);
  });

  it('should not mutate input', () => {
    const input = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url: 'Mr-Tickle-9a.png'
      },
      {
        username: 'grumpy19',
        name: 'Paul Grump',
        avatar_url: 'Mr-Grumpy-3A.PNG'
      }
    ];
    const inputControl = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url: 'Mr-Tickle-9a.png'
      },
      {
        username: 'grumpy19',
        name: 'Paul Grump',
        avatar_url: 'Mr-Grumpy-3A.PNG'
      }
    ];

    formatUsers(input);
    expect(input).toStrictEqual(inputControl);
  });

  it('should return an array of user objects with username and avatar_url unamended', () => {
    const input = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url: 'Mr-Tickle-9a.png'
      },
      {
        username: 'grumpy19',
        name: 'Paul Grump',
        avatar_url: 'Mr-Grumpy-3A.PNG'
      },
      {
        username: 'happyamy2016',
        name: 'Amy Happy',
        avatar_url: 'Mr_Happy.jpg'
      }
    ];

    expect(formatUsers(input)[0]).toHaveProperty('username', 'tickle122');
    expect(formatUsers(input)[0]).toHaveProperty(
      'avatar_url',
      'Mr-Tickle-9a.png'
    );
  });

  it('should return an array of user objects with name split into first_name and last_name', () => {
    const input = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url: 'Mr-Tickle-9a.png'
      },
      {
        username: 'grumpy19',
        name: 'Paul Grump',
        avatar_url: 'Mr-Grumpy-3A.PNG'
      },
      {
        username: 'happyamy2016',
        name: 'Amy Happy',
        avatar_url: 'Mr_Happy.jpg'
      }
    ];

    expect(formatUsers(input)[0]).toHaveProperty('first_name', 'Tom');
    expect(formatUsers(input)[0]).toHaveProperty('last_name', 'Tickle');
  });
});

describe('createRefObj', () => {
  it('should return an object', () => {
    expect(createRefObj([])).toBeInstanceOf(Object);
  });

  it('should not mutate input', () => {
    const input = [
      {
        topic_id: 1,
        slug: 'coding',
        description: 'Code is love, code is life'
      },
      { topic_id: 2, slug: 'football', description: 'FOOTIE!' },
      {
        topic_id: 3,
        slug: 'cooking',
        description: 'Hey good looking, what you got cooking?'
      }
    ];

    const inputControl = [
      {
        topic_id: 1,
        slug: 'coding',
        description: 'Code is love, code is life'
      },
      { topic_id: 2, slug: 'football', description: 'FOOTIE!' },
      {
        topic_id: 3,
        slug: 'cooking',
        description: 'Hey good looking, what you got cooking?'
      }
    ];

    createRefObj(input, 'slug', 'topic_id');
    expect(input).toStrictEqual(inputControl);
  });

  it('should return an object with one username-id key-value pair when passed an array of one user object', () => {
    const input = [
      {
        user_id: 1,
        username: 'tickle122',
        first_name: 'Tom',
        last_name: 'Tickle',
        avatar_url: 'Mr-Tickle-9a.png'
      }
    ];

    expect(createRefObj(input, 'username', 'user_id')).toHaveProperty(
      'tickle122',
      1
    );
  });

  it('should return an object with a slug-topic_id key-value pair for each object in array', () => {
    const input = [
      {
        topic_id: 1,
        slug: 'coding',
        description: 'Code is love, code is life'
      },
      { topic_id: 2, slug: 'football', description: 'FOOTIE!' },
      {
        topic_id: 3,
        slug: 'cooking',
        description: 'Hey good looking, what you got cooking?'
      }
    ];

    expect(createRefObj(input, 'slug', 'topic_id')).toHaveProperty('coding', 1);
    expect(createRefObj(input, 'slug', 'topic_id')).toHaveProperty(
      'football',
      2
    );
    expect(createRefObj(input, 'slug', 'topic_id')).toHaveProperty(
      'cooking',
      3
    );
  });
});

describe('formatArticles', () => {
  it('should return an array', () => {
    expect(formatArticles([])).toBeInstanceOf(Array);
  });

  it('should not mutate input', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body: 'This is part two',
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        body: 'Many people know Watson',
        created_at: 1500584273256
      }
    ];

    const inputControl = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body: 'This is part two',
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        body: 'Many people know Watson',
        created_at: 1500584273256
      }
    ];
    const topicRefObj = { coding: 1, football: 2, cooking: 3 };
    const userRefObj = { jessjelly: 6, happyamy2016: 3, grumpy19: 2 };

    formatArticles(input, topicRefObj, userRefObj);
    expect(input).toStrictEqual(inputControl);
  });

  it('should convert JavaScript Unix Epoch into PostgresSQL timestamp', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body: 'This is part two',
        created_at: 1471522072389
      }
    ];
    const topicRefObj = { coding: 1 };
    const userRefObj = { jessjelly: 6 };

    const expectedDate = new Date(1471522072389);

    expect(formatArticles(input, topicRefObj, userRefObj)).toHaveProperty(
      [0, 'created_at'],
      expectedDate
    );
    expect(formatArticles(input, topicRefObj, userRefObj)).toHaveProperty(
      [0, 'updated_at'],
      expectedDate
    );
  });

  it('should remove topic key and add topic_id for each object in array', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body: 'This is part two'
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'football',
        author: 'happyamy2016',
        body: 'Many people know Watson',
        created_at: 1500584273256
      }
    ];

    const topicsRefObj = { coding: 1, football: 2 };
    const usersRefObj = { jessjelly: 6, happyamy2016: 3 };

    expect(formatArticles(input, topicsRefObj, usersRefObj)[0]).toHaveProperty(
      'topic_id',
      1
    );
    expect(formatArticles(input, topicsRefObj, usersRefObj)[1]).toHaveProperty(
      'topic_id',
      2
    );
  });

  it('should remove author key and add user_id for each object in array', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body: 'This is part two',
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'happyamy2016',
        body: 'Many people know Watson',
        created_at: 1500584273256
      }
    ];

    const topicsRefObj = { coding: 1, football: 2 };
    const usersRefObj = { jessjelly: 6, happyamy2016: 3 };

    expect(formatArticles(input, topicsRefObj, usersRefObj)[0]).toHaveProperty(
      'user_id',
      6
    );
    expect(formatArticles(input, topicsRefObj, usersRefObj)[1]).toHaveProperty(
      'user_id',
      3
    );
  });

  it('should return an array of articles with updated keys and all other properties maintained', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body: 'This is part two',
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        body: 'Many people know Watson',
        created_at: 1500584273256
      },
      {
        title: '22 Amazing open source React projects',
        topic: 'coding',
        author: 'happyamy2016',
        body: 'This is a',
        created_at: 1500659650346
      }
    ];
    const expected = [
      {
        title: 'Running a Node App',
        topic_id: 1,
        user_id: 6,
        body: 'This is part two',
        created_at: new Date(1471522072389),
        updated_at: new Date(1471522072389)
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic_id: 1,
        user_id: 6,
        body: 'Many people know Watson',
        created_at: new Date(1500584273256),
        updated_at: new Date(1500584273256)
      },
      {
        title: '22 Amazing open source React projects',
        topic_id: 1,
        user_id: 3,
        body: 'This is a',
        created_at: new Date(1500659650346),
        updated_at: new Date(1500659650346)
      }
    ];

    const topicsRefObj = { coding: 1, football: 2, cooking: 3 };
    const usersRefObj = { jessjelly: 6, happyamy2016: 3, grumpy19: 2 };

    expect(formatArticles(input, topicsRefObj, usersRefObj)).toStrictEqual(
      expected
    );
  });
});

describe('formatComments', () => {
  it('should return an array', () => {
    expect(formatComments([])).toBeInstanceOf(Array);
  });

  it('should not mutate input', () => {
    const input = [
      {
        body:
          'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to:
          'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        belongs_to: 'Making sense of Redux',
        created_by: 'grumpy19',
        votes: 7,
        created_at: 1478813209256
      }
    ];

    const inputControl = [
      {
        body:
          'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to:
          'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        belongs_to: 'Making sense of Redux',
        created_by: 'grumpy19',
        votes: 7,
        created_at: 1478813209256
      }
    ];
    const articlesRefObj = {
      'The People Tracking Every Touch, Pass And Tackle in the World Cup': 18,
      'Making sense of Redux': 4
    };
    const usersRefObj = { tickle122: 1, grumpy19: 2 };

    formatComments(input, articlesRefObj, usersRefObj);
    expect(input).toStrictEqual(inputControl);
  });

  it('should convert JavaScript Unix Epoch into PostgresSQL timestamp', () => {
    const input = [
      {
        body: 'Test text',
        belongs_to:
          'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932
      }
    ];

    const articleRefObj = {
      'The People Tracking Every Touch, Pass And Tackle in the World Cup': 18
    };
    const userRefObj = { tickle122: 1 };

    const expectedDate = new Date(1468087638932);

    expect(formatComments(input, articleRefObj, userRefObj)).toHaveProperty(
      [0, 'created_at'],
      expectedDate
    );
    expect(formatComments(input, articleRefObj, userRefObj)).toHaveProperty(
      [0, 'updated_at'],
      expectedDate
    );
  });

  it('should remove created_by key and add user_id for each object in array', () => {
    const input = [
      {
        body: 'Test text',
        belongs_to:
          'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        belongs_to: 'Making sense of Redux',
        created_by: 'grumpy19',
        votes: 7,
        created_at: 1478813209256
      }
    ];

    const articleRefObj = {
      'The People Tracking Every Touch, Pass And Tackle in the World Cup': 18,
      'Making sense of Redux': 15
    };
    const userRefObj = { tickle122: 1, grumpy19: 5 };

    expect(formatComments(input, articleRefObj, userRefObj)[0]).toHaveProperty(
      'user_id',
      1
    );
    expect(formatComments(input, articleRefObj, userRefObj)[1]).toHaveProperty(
      'user_id',
      5
    );
  });

  it('should remove belongs_to key and add article_id for each object in array', () => {
    const input = [
      {
        body: 'Test text',
        belongs_to:
          'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        belongs_to: 'Making sense of Redux',
        created_by: 'grumpy19',
        votes: 7,
        created_at: 1478813209256
      }
    ];

    const articleRefObj = {
      'The People Tracking Every Touch, Pass And Tackle in the World Cup': 18,
      'Making sense of Redux': 15
    };
    const userRefObj = { tickle122: 1, grumpy19: 5 };

    expect(formatComments(input, articleRefObj, userRefObj)[0]).toHaveProperty(
      'article_id',
      18
    );
    expect(formatComments(input, articleRefObj, userRefObj)[1]).toHaveProperty(
      'article_id',
      15
    );
  });

  it('should return an array of comments with updated keys and all other properties maintained', () => {
    const input = [
      {
        body:
          'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to:
          'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        belongs_to: 'Making sense of Redux',
        created_by: 'grumpy19',
        votes: 7,
        created_at: 1478813209256
      },
      {
        body:
          'Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.',
        belongs_to: '22 Amazing open source React projects',
        created_by: 'grumpy19',
        votes: 3,
        created_at: 1504183900263
      }
    ];
    const expected = [
      {
        body:
          'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        article_id: 18,
        user_id: 1,
        votes: -1,
        created_at: new Date(1468087638932),
        updated_at: new Date(1468087638932)
      },
      {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        article_id: 4,
        user_id: 2,
        votes: 7,
        created_at: new Date(1478813209256),
        updated_at: new Date(1478813209256)
      },
      {
        body:
          'Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.',
        article_id: 3,
        user_id: 2,
        votes: 3,
        created_at: new Date(1504183900263),
        updated_at: new Date(1504183900263)
      }
    ];

    const articlesRefObj = {
      'The People Tracking Every Touch, Pass And Tackle in the World Cup': 18,
      'Making sense of Redux': 4,
      '22 Amazing open source React projects': 3
    };
    const usersRefObj = { tickle122: 1, grumpy19: 2, happyamy2016: 3 };

    expect(formatComments(input, articlesRefObj, usersRefObj)).toStrictEqual(
      expected
    );
  });
});
