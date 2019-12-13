'use strict';

const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const path = require('path');
const socketIO = require('socket.io');

const {
  errorMiddleware,
  loggerMiddleware,
  userAuthMiddleware
} = require('middleware');
const { chats, ping, users } = require('routes');
const TokenServide = require('tokenService');
const initializeWebsocketServer = require('websocket');

const app = express();
const httpServer = http.Server(app);

const io = socketIO(httpServer);
initializeWebsocketServer(io);

mongoose
  .connect(process.env.MONGO_DB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.error(err));

const User = mongoose.model('users');
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.CHATROOM_SECRET
};
passport.use(
  new Strategy(opts, async ({ id }, done) => {
    const isRevokedToken = await TokenServide.isRevokedToken(id);
    if (!isRevokedToken) {
      try {
        const user = await User.findById(id);
        done(null, user || false);
      } catch (err) {
        done(err, false);
      }
    } else {
      done(null, false);
    }
  })
);

if (process.env.DEV) {
  app.use(loggerMiddleware);
}

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/api/ping', ping);
app.use('/api/users', users);
app.use('/api/chats', chats);

app.use(errorMiddleware);

httpServer.listen(process.env.SERVER_PORT, () =>
  console.log(`Chatroom server listening on :${process.env.SERVER_PORT}`)
);
