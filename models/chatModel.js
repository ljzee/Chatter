const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  chatName: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Chat', ChatSchema);