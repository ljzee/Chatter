const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  profileImageFilename: {
    type: String, 
    default: ''
  }
});

module.exports = mongoose.model('User', UserSchema);
