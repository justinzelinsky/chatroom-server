const express = require('express');
const passport = require('passport');

const { Message } = require('models');
const adminAuthMiddleware = require('middleware/adminAuthMiddleware');

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Message.find({}).then(messages => res.json(messages));
  }
);

router.post(
  '/clear',
  passport.authenticate('jwt', { session: false }),
  adminAuthMiddleware,
  (req, res) => {
    Message.deleteMany({}, err => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).json({ deleted: true });
    });
  }
);

module.exports = router;
