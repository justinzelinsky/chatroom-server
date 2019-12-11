const express = require('express');
const passport = require('passport');

const { Message } = require('models');
const { adminAuthMiddleware, userAuthMiddleware } = require('middleware');

const router = express.Router();

router.get('/', userAuthMiddleware, async (req, res) => {
  const messages = await Message.find({});
  res.json(messages);
});

router.post('/clear', userAuthMiddleware, adminAuthMiddleware, (req, res) => {
  Message.deleteMany({}, err => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json({ deleted: true });
  });
});

module.exports = router;
