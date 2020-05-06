const express = require('express');
const apiRouter = require('./routes/api.router.js');
const {
  usRouteHandler,
  customErrorHandler,
  knexErrorHandler,
  internalErrorHandler
} = require('./controllers/error.controllers');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);
app.use(usRouteHandler);

app.use(customErrorHandler);
app.use(knexErrorHandler);
app.use(internalErrorHandler);

module.exports = app;
