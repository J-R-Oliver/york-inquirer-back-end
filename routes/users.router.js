const usersRouter = require('express').Router();
const {
  getUsers,
  getUser,
  postUser
} = require('../controllers/users.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

usersRouter.route('/').get(getUsers).post(postUser).all(usMethodHandler);
usersRouter.route('/:username').get(getUser).all(usMethodHandler);

module.exports = usersRouter;
