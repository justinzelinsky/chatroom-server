const passport = require('passport');

const userAuthMiddleware = passport.authenticate('jwt', {
  failWithError: true,
  session: false,
});

module.exports = userAuthMiddleware;
