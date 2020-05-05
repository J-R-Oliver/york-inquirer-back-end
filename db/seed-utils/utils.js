exports.formatUsers = usersArr => {
  return usersArr.map(user => {
    const { name, ...userNoName } = user;
    const [first_name, last_name] = name.split(' ');
    return { ...userNoName, first_name, last_name };
  });
};

exports.createRefObj = (objArr, keyOne, keyTwo) => {
  return objArr.reduce((acc, obj) => {
    return { ...acc, [obj[keyOne]]: obj[keyTwo] };
  }, {});
};

exports.formatArticles = (articlesArr, topicRefObj, userRefObj) => {
  return articlesArr.map(article => {
    const { topic, author, created_at: unixEpochTime, ...titleBody } = article;

    const created_at = new Date(unixEpochTime);

    return {
      topic_id: topicRefObj[topic],
      user_id: userRefObj[author],
      created_at,
      updated_at: created_at,
      ...titleBody
    };
  });
};
