exports.usMethodHandler = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.usRouteHandler = (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.knexErrorHandler = (err, req, res, next) => {
  const errorCodes = {
    '22P02': { status: 400, msg: 'Invalid Request' },
    23503: { status: 404, msg: 'Article Not Found' }
  };

  if (err.code in errorCodes) {
    const { status, msg } = errorCodes[err.code];
    res.status(status).send({ msg });
  } else next(err);
};

exports.internalErrorHandler = (err, req, res, next) => {
  console.log('Unhandled error:', err);
  res.status(500).send({ msg: 'Internal Server Error' });
};
