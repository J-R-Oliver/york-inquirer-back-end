const { PORT = 9090 } = process.env;

const app = require('./app');

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
