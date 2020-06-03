const Chat = require('models/Chat');
const {
  ADD_USER,
  ADMIN_USER,
  CONNECTION,
  DISCONNECT,
  NEW_ADMIN_CHAT,
  NEW_CHAT,
  USER_JOINED,
  USER_LEFT,
  USER_START_TYPING,
  USER_STOP_TYPING,
  USERS_TYPING
} = require('websocket/constants');

let connectedUsers = [];
let usersTyping = [];

function userJoinChat (username) {
  return {
    isAdminChat: true,
    message: `${username} has joined the chat.`,
    ts: new Date().valueOf(),
    user: ADMIN_USER
  };
}

function userLeftChat (username) {
  return {
    isAdminChat: true,
    message: `${username} has left the chat.`,
    ts: new Date().valueOf(),
    user: ADMIN_USER
  };
}

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
  return function (user) {
    socket.user = user;
    connectedUsers.push(user);

    io.emit(USER_JOINED, connectedUsers);

    socket.broadcast.emit(NEW_ADMIN_CHAT, userJoinChat(socket.user.name));
  };
}

function handleDisconnect (io, socket) {
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
    socket.on(DISCONNECT, handleDisconnect());
  });
}

module.exports = initializeWebsocketServer;
