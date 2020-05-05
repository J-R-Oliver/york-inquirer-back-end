const app = require('express')();
const apiRouter = require('./routes/api.router.js');

app.use('/api', apiRouter);

module.exports = app;
