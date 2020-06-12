const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const { userAuthMiddleware } = require('middleware');
const { User } = require('models');
const { revokeUserToken, setUserToken } = require('tokenService');
const {
  validateLoginInput,
  validateRegisterInput,
  validateUpdateInput,
} = require('validation');

const router = express.Router();
const CHATROOM_SECRET = process.env.CHATROOM_SECRET;

function cleanUsers (rawUsers) {
  return rawUsers.map(({ name, email, _id }) => ({ name, email, id: _id }));
}

router.get('/', userAuthMiddleware, async function (req, res) {
  const rawUsers = await User.find({});
  const cleanedUsers = cleanUsers(rawUsers);
  res.json(cleanedUsers);
});

router.post('/update', userAuthMiddleware, async function (req, res) {
  const { error, isValid } = validateUpdateInput(req.body);

  if (!isValid) {
    return res.status(400).json({ error });
  }

  const { email, name } = req.body;
  const userUpdateFields = {};
  if (email) {
    userUpdateFields.email = email;
  }
  if (name) {
    userUpdateFields.name = name;
  }

  const user = await User.findOneAndUpdate(
    {
      _id: req.user.id,
    },
    userUpdateFields,
    {
      new: true,
    }
  );

  const payload = {
    admin: user.admin,
    email: user.email,
    id: user.id,
    name: user.name,
  };

  jwt.sign(
    payload,
    CHATROOM_SECRET,
    {
      expiresIn: '1h',
    },
    function (err, token) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({
        success: true,
        token: `Bearer ${token}`,
      });
    }
  );
});

router.post('/register', async function (req, res) {
  const { error, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json({ error });
  }

  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newUser = new User({
    name,
    email,
    password,
  });

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);

    newUser.password = hash;

    await newUser.save();

    res.json(user);
  } catch (error) {
    res.stats(500).json({ error });
  }
});

router.post('/login', async function (req, res) {
  const { error, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json({ error });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'Email not found' });
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (isCorrectPassword) {
    const payload = {
      admin: user.admin,
      email: user.email,
      id: user.id,
      name: user.name,
    };

    jwt.sign(payload, CHATROOM_SECRET, { expiresIn: '1h' }, function (
      err,
      token
    ) {
      if (err) {
        return res.sendStatus(500);
      }
      setUserToken(user.id, token);
      res.json({
        success: true,
        token: `Bearer ${token}`,
      });
    });
  } else {
    return res.status(400).json({ error: 'Incorrect Password' });
  }
});

router.get('/logout', userAuthMiddleware, async function (req, res) {
  const token = req.headers['authorization'].split(' ')[0];
  await revokeUserToken(req.user.id, token);
  res.json({ logout: true });
});

module.exports = router;
