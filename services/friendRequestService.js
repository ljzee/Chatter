const friendRequestModelModule = require('../models/friendRequestModel');
const FriendRequestModel = friendRequestModelModule.model;

module.exports = {
  doesPendingRequestExist,
  createRequest,
  findPendingRequestsByUserId,
  doesUserOwnPendingRequest,
  deletePendingRequest
};

async function doesPendingRequestExist(senderId, receiverId) {
  const request = await FriendRequestModel.findOne({
    sender: senderId,
    receiver: receiverId,
    status: friendRequestModelModule.FRIEND_REQUEST_STATUS_PENDING
  }).exec();

  return request !== null;
}

async function createRequest(senderId, receiverId) {
  let friendRequest = new FriendRequestModel({
    sender: senderId,
    receiver: receiverId
  });

  return await friendRequest.save();
}

async function findPendingRequestsByUserId(userId) {
  let pendingRequests = await FriendRequestModel.find({
    $or: [
      {
        sender: userId,
        status: friendRequestModelModule.FRIEND_REQUEST_STATUS_PENDING
      },
      {
        receiver: userId,
        status: friendRequestModelModule.FRIEND_REQUEST_STATUS_PENDING
      }
    ]
  })
  .populate('sender', 'email')
  .populate('receiver', 'email')
  .exec();

  pendingRequests = pendingRequests.map((pendingRequest) => {
    pendingRequestObject = pendingRequest.toObject();
    pendingRequestObject.isOutgoingRequest = pendingRequest.sender.id === userId;
    return pendingRequestObject;
  });

  return pendingRequests;
}

async function doesUserOwnPendingRequest(userId, requestId) {
  const request = await FriendRequestModel.findById(requestId).exec();

  if(!request) {
    return false;
  }

  return request.sender._id.toString() === userId;
}

async function deletePendingRequest(requestId) {
  const deleteResult = await FriendRequestModel.deleteOne({_id: requestId}).exec();

  return deleteResult.deletedCount === 1;
}
