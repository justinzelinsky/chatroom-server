const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}]: Requesting ${req.path}`);
  next();
};

module.exports = loggerMiddleware;
