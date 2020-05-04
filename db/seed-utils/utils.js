exports.formatUsers = usersArr => {
  return usersArr.map(user => {
    const { name, ...userNoName } = user;
    const [first_name, last_name] = name.split(' ');
    return { ...userNoName, first_name, last_name };
  });
};
