const {
  formatUsers,
  createRefObj,
  formatArticles
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

    const topicRefObj = { coding: 1, football: 2, cooking: 3 };
    const userRefObj = { jessjelly: 6, happyamy2016: 3, grumpy19: 2 };

    expect(formatArticles(input, topicRefObj, userRefObj)).toStrictEqual(
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
