const express = require('express');
const { userAuthMiddleware } = require('middleware');

const router = express.Router();

router.get('/', userAuthMiddleware, function (req, res) {
  res.json({ pong: true });
});

module.exports = router;
