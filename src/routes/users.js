const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { User } = require('models');
const TokenService = require('tokenService');
const {
  validateLoginInput,
  validateRegisterInput,
  validateUpdateInput
} = require('validation');

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.find({}).then(users => {
      const cleanUsers = users.map(({ name, email, _id }) => ({
        name,
        email,
        id: _id
      }));
      res.json(cleanUsers);
    });
  }
);

router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
    const id = req.user.id;
    User.findOneAndUpdate({ _id: id }, userUpdateFields, { new: true }).then(
      user => {
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
            expiresIn: 31556926
          },
          (err, token) => {
            if (err) {
              res.status(500).json(err);
            }
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
            TokenService.setToken(user.id, token);
          }
        );
      }
    );
  }
);

router.post('/register', (req, res) => {
  const { error, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json({ error });
  }

  const { name, email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = new User({
      name,
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => res.sendStatus(500));
      });
    });
  });
});

router.post('/login', (req, res) => {
  const { error, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json({ error });
  }
  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
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
            expiresIn: 31556926
          },
          (err, token) => {
            if (err) {
              return res.sendStatus(500);
            }
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
            TokenService.setToken(user.id, token);
          }
        );
      } else {
        return res.status(400).json({ error: 'Password incorrect' });
      }
    });
  });
});

router.get(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    await TokenService.deleteToken(req.user.id);
    res.json({ logout: true });
  }
);

module.exports = router;
