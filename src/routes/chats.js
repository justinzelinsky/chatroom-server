const express = require('express');
const passport = require('passport');

const { Chat } = require('models');
const { adminAuthMiddleware, userAuthMiddleware } = require('middleware');

const router = express.Router();

router.get('/', userAuthMiddleware, async function(req, res) {
  const chats = await Chat.find({});
  res.json(chats);
});

router.post('/clear', userAuthMiddleware, adminAuthMiddleware, function(
  req,
  res
) {
  Chat.deleteMany({}, err => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json({ deleted: true });
  });
});

module.exports = router;
