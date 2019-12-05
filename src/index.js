'use strict';

const bodyParser = require('body-parser');
const connectMongo = require('connect-mongo');
const express = require('express');
const expressSession = require('express-session');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const path = require('path');
const socketIO = require('socket.io');

const { loggerMiddleware } = require('middleware');
const { messages, users } = require('routes');
const initializeWebsocketServer = require('websocket');

const PORT = process.env.PORT || 8083;
const app = express();
const httpServer = http.Server(app);
const MongoStore = connectMongo(expressSession);

const io = socketIO(httpServer);
initializeWebsocketServer(io);

mongoose
  .connect(process.env.MONGO_DB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));
const mongooseConnection = mongoose.connection;

const User = mongoose.model('users');
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.CHATROOM_SECRET
};
passport.use(
  new Strategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then(user => done(null, user || false))
      .catch(err => console.log(err));
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
app.use(
  expressSession({
    secret: process.env.CHATROOM_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection
    })
  })
);
app.use(passport.initialize());
app.use('/api/users', users);
app.use('/api/messages', messages);

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
