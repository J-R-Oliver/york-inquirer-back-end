exports.usMethodHandler = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.usRouteHandler = (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
};
