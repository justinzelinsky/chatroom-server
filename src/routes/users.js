const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { userAuthMiddleware } = require('middleware');
const { User } = require('models');
const TokenService = require('tokenService');
const {
  validateLoginInput,
  validateRegisterInput,
  validateUpdateInput
} = require('validation');

const router = express.Router();

router.get('/', userAuthMiddleware, async function(req, res) {
  const users = await User.find({});
  const cleanUsers = users.map(({ name, email, _id }) => ({
    name,
    email,
    id: _id
  }));
  res.json(cleanUsers);
});

router.post('/update', userAuthMiddleware, async function(req, res) {
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
    { _id: req.user.id },
    userUpdateFields,
    {
      new: true
    }
  );

  const payload = {
    admin: user.admin,
    email: user.email,
    id: user.id,
    name: user.name
  };

  jwt.sign(
    payload,
    process.env.CHATROOM_SECRET,
    {
      expiresIn: '1h'
    },
    function(err, token) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({
        success: true,
        token: `Bearer ${token}`
      });
    }
  );
});

router.post('/register', function(req, res) {
  const { error, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json({ error });
  }

  const { name, email, password } = req.body;

  User.findOne({ email }).then(function(user) {
    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = new User({
      name,
      email,
      password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => res.sendStatus(500));
      });
    });
  });
});

router.post('/login', async function(req, res) {
  const { error, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json({ error });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'Email not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    const payload = {
      admin: user.admin,
      email: user.email,
      id: user.id,
      name: user.name
    };

    jwt.sign(
      payload,
      process.env.CHATROOM_SECRET,
      {
        expiresIn: '1h'
      },
      function(err, token) {
        if (err) {
          return res.sendStatus(500);
        }
        res.json({
          success: true,
          token: `Bearer ${token}`
        });
      }
    );
  } else {
    return res.status(400).json({ error: 'Incorrect Password' });
  }
});

router.get('/logout', userAuthMiddleware, async function(req, res, next) {
  const token = req.headers['Authorization'].split(' ')[0];
  await TokenService.revokeUserToken(req.user.id, token);
  res.json({ logout: true });
});

module.exports = router;
