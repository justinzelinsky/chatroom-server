'use strict';

const connectMongo = require('connect-mongo');
const bodyParser = require('body-parser');
const express = require('express');
const expressSession = require('express-session');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const socketIO = require('socket.io');

const config = require('config/keys');
const configurePassport = require('config/configurePassport');
const { messages, users } = require('routes/api');
const initializeWebsocketServer = require('websocket');

const PORT = process.env.PORT || 8083;
const app = express();
const httpServer = http.Server(app);
const MongoStore = connectMongo(expressSession);

// Setup Websocket Server
const io = socketIO(httpServer);
initializeWebsocketServer(io);

// Setup MongoDB
mongoose
  .connect(config.mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB successfully connected')) // eslint-disable-line
  .catch(err => console.log(err)); // eslint-disable-line
const mongooseConnection = mongoose.connection;

configurePassport(passport);

// Setup Express
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

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`)); // eslint-disable-line
