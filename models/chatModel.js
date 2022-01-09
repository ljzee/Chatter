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

ChatSchema.methods.getChatName = async function() {
    if(this.chatName === null) {
        await this.populate('participants');
        const usernames = this.participants.map((participant) => {
            return participant.username;
        });
        return usernames.join(", ");
    }

    return this.chatName;
}

module.exports = mongoose.model('Chat', ChatSchema);