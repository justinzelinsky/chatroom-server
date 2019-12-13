const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ChatSchema = new Schema({
  user: {
    type: Map,
    of: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  ts: {
    type: Number,
    required: true
  },
  isAdminChat: {
    type: Boolean,
    required: true
  }
});
const Chat = mongoose.model('chats', ChatSchema);

module.exports = Chat;
