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

const userJoinChat = username => ({
  isAdminChat: true,
  message: `${username} has joined the chat.`,
  ts: new Date().valueOf(),
  user: ADMIN_USER
});

const userLeftChat = username => ({
  isAdminChat: true,
  message: `${username} has left the chat.`,
  ts: new Date().valueOf(),
  user: ADMIN_USER
});

const initializeWebsocketServer = io => {
  let connectedUsers = [];
  let usersTyping = [];

  io.on(CONNECTION, socket => {
    socket.on(NEW_CHAT, newChat => {
      const chat = new Chat(newChat);
      chat.save().then(() => socket.broadcast.emit(NEW_CHAT, newChat));
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

      socket.broadcast.emit(NEW_ADMIN_CHAT, userJoinChat(socket.user.name));
    });

    socket.on(DISCONNECT, () => {
      if (socket.user) {
        connectedUsers = connectedUsers.filter(
          user => user.id !== socket.user.id
        );

        io.emit(USER_LEFT, connectedUsers);

        socket.broadcast.emit(NEW_ADMIN_CHAT, userLeftChat(socket.user.name));
      }
    });
  });
};

module.exports = initializeWebsocketServer;
