const { formatUsers, createRefObj } = require('../db/seed-utils/utils');

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

    const output = {
      tickle122: 1
    };

    expect(createRefObj(input, 'username', 'user_id')).toStrictEqual(output);
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

    const output = {
      coding: 1,
      football: 2,
      cooking: 3
    };

    expect(createRefObj(input, 'slug', 'topic_id')).toStrictEqual(output);
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
