const { User } = require('models');

function adminAuthMiddleware(req, res, next) {
  const id = req.user.id;

  if (!id) {
    return res.sendStatus(401);
  }

  User.findById(id, function(err, user) {
    if (err) {
      console.error(`Unknown user id: ${id}`);
      return res.sendStatus(401);
    }

    if (user.admin) {
      next();
    } else {
      return res.sendStatus(401);
    }
  });
}

module.exports = adminAuthMiddleware;
