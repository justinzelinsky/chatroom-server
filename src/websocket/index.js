const Message = require('models/Message');
const {
  ADD_USER,
  ADMIN_USER,
  NEW_ADMIN_CHAT,
  NEW_CHAT,
  USER_JOINED,
  USER_LEFT,
  USER_START_TYPING,
  USER_STOP_TYPING,
  USERS_TYPING
} = require('websocket/constants');

const initializeWebsocketServer = io => {
  let connectedUsers = [];
  let usersTyping = [];

  io.on('connection', socket => {
    socket.on(NEW_CHAT, chat => {
      const message = new Message(chat);
      message.save().then(() => socket.broadcast.emit(NEW_CHAT, chat));
    });

    socket.on(USER_START_TYPING, user => {
      usersTyping.push(user);
      socket.broadcast.emit(USERS_TYPING, usersTyping);
    });

    socket.on(USER_STOP_TYPING, user => {
      usersTyping = usersTyping.filter(typingUser => typingUser.id !== user.id);
      socket.broadcast.emit(USERS_TYPING, usersTyping);
    });

    socket.on(ADD_USER, user => {
      socket.user = user;
      connectedUsers.push(user);

      io.emit(USER_JOINED, connectedUsers);

      socket.broadcast.emit(NEW_ADMIN_CHAT, {
        isAdminMessage: true,
        user: ADMIN_USER,
        ts: new Date().valueOf(),
        message: `${socket.user.name} has joined the chat.`
      });
    });

    socket.on('disconnect', () => {
      if (socket.user) {
        connectedUsers = connectedUsers.filter(
          user => user.id !== socket.user.id
        );

        io.emit(USER_LEFT, connectedUsers);

        socket.broadcast.emit(NEW_ADMIN_CHAT, {
          isAdminMessage: true,
          user: ADMIN_USER,
          ts: new Date().valueOf(),
          message: `${socket.user.name} has left the chat.`
        });
      }
    });
  });
};

module.exports = initializeWebsocketServer;
