const app = require('express')();
const apiRouter = require('./routes/api.router.js');
const { usRouteHandler } = require('./controllers/error.controllers');

app.use('/api', apiRouter);
app.use(usRouteHandler);

module.exports = app;
