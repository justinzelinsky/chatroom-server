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

function userJoinChat(username) {
  return {
    isAdminChat: true,
    message: `${username} has joined the chat.`,
    ts: new Date().valueOf(),
    user: ADMIN_USER
  };
}

function userLeftChat(username) {
  return {
    isAdminChat: true,
    message: `${username} has left the chat.`,
    ts: new Date().valueOf(),
    user: ADMIN_USER
  }
}

function initializeWebsocketServer(io) {
  let connectedUsers = [];
  let usersTyping = [];

  io.on(CONNECTION, function(socket) {
    socket.on(NEW_CHAT, function(newChat) {
      const chat = new Chat(newChat);
      chat.save().then(() => socket.broadcast.emit(NEW_CHAT, newChat));
    });

    socket.on(USER_START_TYPING, function(user) {
      usersTyping.push(user);
      socket.broadcast.emit(USERS_TYPING, usersTyping);
    });

    socket.on(USER_STOP_TYPING, function(user) {
      usersTyping = usersTyping.filter(typingUser => typingUser.id !== user.id);
      socket.broadcast.emit(USERS_TYPING, usersTyping);
    });

    socket.on(ADD_USER, function(user) {
      socket.user = user;
      connectedUsers.push(user);

      io.emit(USER_JOINED, connectedUsers);

      socket.broadcast.emit(NEW_ADMIN_CHAT, userJoinChat(socket.user.name));
    });

    socket.on(DISCONNECT, function() {
      if (socket.user) {
        connectedUsers = connectedUsers.filter(
          user => user.id !== socket.user.id
        );

        io.emit(USER_LEFT, connectedUsers);

        socket.broadcast.emit(NEW_ADMIN_CHAT, userLeftChat(socket.user.name));
      }
    });
  });
}

module.exports = initializeWebsocketServer;
