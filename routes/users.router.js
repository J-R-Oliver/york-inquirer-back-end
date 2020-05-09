const usersRouter = require('express').Router();
const { getUser } = require('../controllers/users.controllers');
const { usMethodHandler } = require('../controllers/error.controllers');

usersRouter.route('/:username').get(getUser).all(usMethodHandler);

module.exports = usersRouter;
