const mongoose = require('mongoose');

const FRIEND_REQUEST_STATUS_PENDING = "PENDING";
const FRIEND_REQUEST_STATUS_ACCEPTED = "ACCEPTED";
const FRIEND_REQUEST_STATUS_REJECTED = "REJECTED";

const FriendRequestSchema = new mongoose.Schema({
  sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
  receiver: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User'
            },
  status: {
            type: String,
            enum: [
                    FRIEND_REQUEST_STATUS_PENDING,
                    FRIEND_REQUEST_STATUS_ACCEPTED,
                    FRIEND_REQUEST_STATUS_REJECTED
                  ],
            default: FRIEND_REQUEST_STATUS_PENDING
          },
  sentAt: {
            type: Date,
            default: Date.now
          }
});

module.exports = {
  model: mongoose.model('FriendRequest', FriendRequestSchema),
  FRIEND_REQUEST_STATUS_PENDING,
  FRIEND_REQUEST_STATUS_ACCEPTED,
  FRIEND_REQUEST_STATUS_REJECTED
};
