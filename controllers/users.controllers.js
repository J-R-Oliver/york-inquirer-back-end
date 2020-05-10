const {
  selectUsers,
  selectUser,
  insertUser
} = require('../models/users.models');

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then(users => {
      res.send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;

  selectUser(username)
    .then(([user]) => {
      res.send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { username, avatar_url, first_name, last_name } = req.body;

  insertUser(username, avatar_url, first_name, last_name)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
