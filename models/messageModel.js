const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  contents: String,
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }
});

module.exports = mongoose.model('Message', MessageSchema);