const express = require('express');

const { Message } = require('models');
const adminAuthMiddleware = require('middleware/adminAuthMiddleware');
const userAuthMiddleware = require('middleware/userAuthMiddleware');

const router = express.Router();

router.get('/', userAuthMiddleware, (req, res) => {
  Message.find({}).then(messages => res.json(messages));
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
