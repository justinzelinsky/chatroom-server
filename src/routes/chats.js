const express = require('express');
const { adminAuthMiddleware, userAuthMiddleware } = require('middleware');
const { Chat } = require('models');

const router = express.Router();

router.get('/', userAuthMiddleware, async function (req, res) {
  const chats = await Chat.find({});
  res.json(chats);
});

router.post('/clear', userAuthMiddleware, adminAuthMiddleware, async function (req, res) {
  try {
    await Chat.deleteMany({});

    res.status(200).json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
