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

ChatSchema.methods.getParticipantUsernames = async function() {
    if(!this.populated('participants')) {
        await this.populate('participants');
    }

    const usernames = this.participants.map((participant) => {
        return participant.username;
    });
    
    return usernames;
}

module.exports = mongoose.model('Chat', ChatSchema);