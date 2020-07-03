const { User } = require('models');

async function adminAuthMiddleware (req, res, next) {
  const { id } = req.user;

  if (!id) {
    return res.sendStatus(401);
  }

  try {
    const user = await User.findById(id);

    if (user.admin) {
      next();
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    console.log(`Unknown user id: ${id}`);
    return res.sendStatus(401);
  }
}

module.exports = adminAuthMiddleware;
