const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/users.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

usersRouter.route('/:username').get(getUsers).all(usMethodHandler);

module.exports = usersRouter;
