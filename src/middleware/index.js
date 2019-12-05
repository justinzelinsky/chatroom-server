const adminAuthMiddleware = require('middleware/adminAuthMiddleware');
const userAuthMiddleware = require('middleware/userAuthMiddleware');
const loggerMiddleware = require('middleware/loggerMiddleware');

module.exports = { adminAuthMiddleware, loggerMiddleware, userAuthMiddleware };
