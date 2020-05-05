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

  it('should work for an array of one user', () => {
    const input = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      }
    ];

    const expected = [
      {
        username: 'tickle122',
        first_name: 'Tom',
        last_name: 'Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      }
    ];

    expect(formatUsers(input)).toStrictEqual(expected);
  });

  it('should work for an array of more than one user', () => {
    const input = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      },
      {
        username: 'grumpy19',
        name: 'Paul Grump',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013'
      },
      {
        username: 'happyamy2016',
        name: 'Amy Happy',
        avatar_url:
          'https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729'
      }
    ];

    const expected = [
      {
        username: 'tickle122',
        first_name: 'Tom',
        last_name: 'Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      },
      {
        username: 'grumpy19',
        first_name: 'Paul',
        last_name: 'Grump',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013'
      },
      {
        username: 'happyamy2016',
        first_name: 'Amy',
        last_name: 'Happy',
        avatar_url:
          'https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729'
      }
    ];

    expect(formatUsers(input)).toStrictEqual(expected);
  });

  it('should not mutate input', () => {
    const input = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      },
      {
        username: 'grumpy19',
        name: 'Paul Grump',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013'
      }
    ];
    const inputControl = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      },
      {
        username: 'grumpy19',
        name: 'Paul Grump',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013'
      }
    ];

    formatUsers(input);
    expect(input).toStrictEqual(inputControl);
  });
});

describe('createRefObj', () => {
  it('should return an object', () => {
    expect(createRefObj([])).toBeInstanceOf(Object);
  });

  it('should work for an array of one object', () => {
    const input = [
      {
        user_id: 1,
        username: 'tickle122',
        first_name: 'Tom',
        last_name: 'Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      }
    ];

    const expected = {
      tickle122: 1
    };

    expect(createRefObj(input, 'username', 'user_id')).toStrictEqual(expected);
  });

  it('should work for an array of more than one object', () => {
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

    const expected = {
      coding: 1,
      football: 2,
      cooking: 3
    };

    expect(createRefObj(input, 'slug', 'topic_id')).toStrictEqual(expected);
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
});

describe('formatArticles', () => {
  it('should return an array', () => {
    expect(formatArticles([])).toBeInstanceOf(Array);
  });

  it('should convert JavaScript Unix Epoch into PosgtreSQL timestamp', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
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

  it('should work for an array of one object', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389
      }
    ];
    const expected = [
      {
        title: 'Running a Node App',
        topic_id: 1,
        user_id: 6,
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: new Date(1471522072389),
        updated_at: new Date(1471522072389)
      }
    ];

    const topicRefObj = { coding: 1 };
    const userRefObj = { jessjelly: 6 };

    expect(formatArticles(input, topicRefObj, userRefObj)).toStrictEqual(
      expected
    );
  });

  it('should work for an array of more than one object', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        body:
          'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        created_at: 1500584273256
      },
      {
        title: '22 Amazing open source React projects',
        topic: 'coding',
        author: 'happyamy2016',
        body:
          'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
        created_at: 1500659650346
      }
    ];
    const expected = [
      {
        title: 'Running a Node App',
        topic_id: 1,
        user_id: 6,
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: new Date(1471522072389),
        updated_at: new Date(1471522072389)
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic_id: 1,
        user_id: 6,
        body:
          'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        created_at: new Date(1500584273256),
        updated_at: new Date(1500584273256)
      },
      {
        title: '22 Amazing open source React projects',
        topic_id: 1,
        user_id: 3,
        body:
          'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
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

  it('should not mutate input', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        body:
          'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        created_at: 1500584273256
      }
    ];

    const inputControl = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        body:
          'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        created_at: 1500584273256
      }
    ];
    const topicRefObj = { coding: 1, football: 2, cooking: 3 };
    const userRefObj = { jessjelly: 6, happyamy2016: 3, grumpy19: 2 };

    formatArticles(input, topicRefObj, userRefObj);
    expect(input).toStrictEqual(inputControl);
  });
});

describe('formatComments', () => {
  it('should return an array', () => {
    expect(formatComments([])).toBeInstanceOf(Array);
  });

  it('should convert JavaScript Unix Epoch into PosgtreSQL timestamp', () => {
    const input = [
      {
        body:
          'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
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

  it('should work for an array of one object', () => {
    const input = [
      {
        body:
          'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to:
          'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932
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
      }
    ];

    const articleRefObj = {
      'The People Tracking Every Touch, Pass And Tackle in the World Cup': 18
    };
    const userRefObj = { tickle122: 1 };

    expect(formatComments(input, articleRefObj, userRefObj)).toStrictEqual(
      expected
    );
  });

  it('should work for an array of more than one object', () => {
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
});
