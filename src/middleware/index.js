const adminAuthMiddleware = require('middleware/adminAuthMiddleware');
const errorMiddleware = require('middleware/errorMiddleware');
const loggerMiddleware = require('middleware/loggerMiddleware');
const userAuthMiddleware = require('middleware/userAuthMiddleware');

module.exports = {
  adminAuthMiddleware,
  errorMiddleware,
  loggerMiddleware,
  userAuthMiddleware
};
