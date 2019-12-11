const errorMiddleware = (err, req, res, next) => {
  const error = {
    name: err.name,
    message: err.message,
    text: err.toString()
  };

  res.status(err.status).json(error);
};

module.exports = errorMiddleware;
