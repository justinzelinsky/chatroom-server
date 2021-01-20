'use strict';

require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const socketIO = require('socket.io');

const { errorMiddleware, loggerMiddleware } = require('middleware');
const { chats, ping, users } = require('routes');
const initializeWebsocketServer = require('websocket');

const app = express();
const httpServer = http.Server(app);

const io = socketIO(httpServer, {
  cors: {
    origin: 'https://0.0.0.0:9000',
    methods: ['GET', 'POST']
  }
});
initializeWebsocketServer(io);

mongoose
  .connect(process.env.MONGO_DB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to MongoDB at ${process.env.MONGO_DB}`))
  .catch((err) => console.error(err));

const User = mongoose.model('users');
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.CHATROOM_SECRET,
};
passport.use(
  new Strategy(opts, async function ({ id }, done) {
    try {
      const user = await User.findById(id);
      done(null, user || false);
    } catch (err) {
      done(err, false);
    }
  })
);

if (process.env.DEV) {
  app.use(loggerMiddleware);
}

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/api/ping', ping);
app.use('/api/users', users);
app.use('/api/chats', chats);

app.use(errorMiddleware);

httpServer.listen(process.env.SERVER_PORT, function () {
  console.log(`Started server at 127.0.0.1:${process.env.SERVER_PORT}`);
});
