const Chat = require('models/Chat');

const ADD_USER = 'add user';
const CONNECTION = 'connection';
const DISCONNECT = 'disconnect';
const NEW_ADMIN_CHAT = 'new admin chat';
const NEW_CHAT = 'new chat';
const USER_JOINED = 'user joined';
const USER_LEFT = 'user left';
const USER_START_TYPING = 'user start typing';
const USER_STOP_TYPING = 'user stop typing';
const USERS_TYPING = 'users typing';

const ADMIN_USER = {
  name: 'Admin'
};

let connectedUsers = [];
let usersTyping = [];

function handleNewChat (socket) {
  return async function (newChat) {
    const chat = new Chat(newChat);
    await chat.save();
    socket.broadcast.emit(NEW_CHAT, newChat);
  };
}

function handleUserStartTyping (socket) {
  return function (user) {
    usersTyping.push(user);
    socket.broadcast.emit(USERS_TYPING, usersTyping);
  };
}

function handleUserStopTyping (socket) {
  return function (user) {
    usersTyping = usersTyping.filter(typingUser => typingUser.id !== user.id);
    socket.broadcast.emit(USERS_TYPING, usersTyping);
  };
}

function handleAddUser (io, socket) {
  function userJoinChat (username) {
    return {
      isAdminChat: true,
      message: `${username} has joined the chat.`,
      ts: new Date().valueOf(),
      user: ADMIN_USER
    };
  }

  return function (user) {
    socket.user = user;
    connectedUsers.push(user);

    io.emit(USER_JOINED, connectedUsers);

    socket.broadcast.emit(NEW_ADMIN_CHAT, userJoinChat(socket.user.name));
  };
}

function handleDisconnect (io, socket) {
  function userLeftChat (username) {
    return {
      isAdminChat: true,
      message: `${username} has left the chat.`,
      ts: new Date().valueOf(),
      user: ADMIN_USER
    };
  }

  return function () {
    if (socket.user) {
      connectedUsers = connectedUsers.filter(
        user => user.id !== socket.user.id
      );

      io.emit(USER_LEFT, connectedUsers);

      socket.broadcast.emit(NEW_ADMIN_CHAT, userLeftChat(socket.user.name));
    }
  };
}

function initializeWebsocketServer (io) {
  io.on(CONNECTION, function (socket) {
    socket.on(NEW_CHAT, handleNewChat(socket));
    socket.on(USER_START_TYPING, handleUserStartTyping(socket));
    socket.on(USER_STOP_TYPING, handleUserStopTyping(socket));
    socket.on(ADD_USER, handleAddUser(io, socket));
    socket.on(DISCONNECT, handleDisconnect(io, socket));
  });
}

module.exports = initializeWebsocketServer;
