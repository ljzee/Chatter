const UserService = require('../services/userService');
const ValidationHelper = require('./validationHelper');
const {body} = require("express-validator");
const FriendRequestService = require('../services/FriendRequestService');
const {validationResult} = require("express-validator");
var UserManager = require('../classes/UserManager');

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
          error: "You already have a pending friend request from this email."
        });
      }

      const newRequest = await FriendRequestService.createRequest(sender.id, receiver.id);

      // Send a websocket message to the receiver if they are online
      if(UserManager.hasUser(receiver.id)) {
        const user = UserManager.getUser(receiver.id);
        user.sendEvent("new-friend-request", {
          "id": newRequest.id,
          "senderEmail": sender.email
        });
      }

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

  const doesUserOwnPendingOutgoingRequest = await FriendRequestService.doesUserOwnPendingOutgoingRequest(req.user.sub, requestId);
  if(!doesUserOwnPendingOutgoingRequest) {
    return res.sendStatus(403);
  }

  await FriendRequestService.deletePendingRequest(requestId);

  res.sendStatus(200);
}

exports.updatePendingRequest = [
    body('acceptRequest')
      .isBoolean({ loose: false }),
    async (req, res, next) => {
      try{
        const requestId = req.params.requestId;

        const doesUserOwnPendingIncomingRequest = await FriendRequestService.doesUserOwnPendingIncomingRequest(req.user.sub, requestId);
        if(!doesUserOwnPendingIncomingRequest) {
          return res.sendStatus(403);
        }

        const errors = validationResult(req);
        const validationErrors = errors.array();
        if(validationErrors.length) {
          return res.sendStatus(400);
        }

        const acceptRequest = req.body.acceptRequest;
        await FriendRequestService.updatePendingRequest(requestId, acceptRequest);

        const pendingRequest = await FriendRequestService.findPendingRequestById(requestId);
        const senderId = pendingRequest.sender.toString();
        if(UserManager.hasUser(senderId)) {
          const sender = UserManager.getUser(senderId);
          sender.sendEvent("update-friend-request", {
            "id": pendingRequest.id,
            "accepted": acceptRequest
          });
        }

        const receiverId = pendingRequest.receiver.toString();
        if(UserManager.hasUser(receiverId)) {
          const receiver = UserManager.getUser(receiverId);
          receiver.sendEvent("update-friend-request", {
            "id": pendingRequest.id,
            "accepted": acceptRequest
          });
        }

        res.sendStatus(200);
      } catch (error) {
        next(error);
      }
    }
]
