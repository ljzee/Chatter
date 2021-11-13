const UserService = require('../services/userService');
const ValidationHelper = require('./validationHelper');
const {body} = require("express-validator");
const FriendRequestService = require('../services/FriendRequestService');

exports.processRequest = [
    body('email')
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .toLowerCase(),
    ValidationHelper.processValidationResults,
    async (req, res, next) => {
      const {email} = req.body;

      let receiver = await UserService.findUserByEmail(email);

      // Check if there is a user with the email.
      if(!receiver) {
        return res.status(400).json({
          error: "Email does not exists."
        });
      }

      // Check if the receiver is the current user.
      if(req.user.sub === receiver.id) {
        return res.status(400).json({
          error: "You cannot send a friend request to yourself."
        });
      }

      // Check if the receiver is already friends with the current user.
      let sender = await UserService.findUserById(req.user.sub);
      var isAlreadyAFriend = sender.friends.some(function(friend) {
          return friend.equals(receiver.id);
      });
      if(isAlreadyAFriend) {
        return res.status(400).json({
          error: email + " is already a friend."
        });
      }

      // Check if there is already a pending friend request sent by the user.
      const pendingSenderRequestExists = await FriendRequestService.doesPendingRequestExist(sender.id, receiver.id);
      if(pendingSenderRequestExists) {
        return res.status(400).json({
          error: "You've already sent a friend request to this email."
        });
      }

      // Check if the receiver had previously sent a friend request to the user that is pending.
      const pendingReceiverRequestExists = await FriendRequestService.doesPendingRequestExist(receiver.id, sender.id);
      if(pendingReceiverRequestExists) {
        res.status(400).json({
          message: "You already have a pending friend request from this email."
        });
      }

      FriendRequestService.createRequest(sender.id, receiver.id);

      // Send a websocket message to the receiver if they are online

      return res.sendStatus(200);
    }
]

exports.getPendingRequests = async (req, res, next) => {
  const pendingRequests = await FriendRequestService.findPendingRequestsByUserId(req.user.sub);

  return res.status(200).json({
    requests: pendingRequests
  });
}

exports.deletePendingRequest = async (req, res, next) => {
  const requestId = req.params.requestId;

  const doesUserOwnPendingRequest = await FriendRequestService.doesUserOwnPendingRequest(req.user.sub, requestId);
  if(!doesUserOwnPendingRequest) {
    return res.sendStatus(403);
  }

  await FriendRequestService.deletePendingRequest(requestId);

  res.sendStatus(200);
}
