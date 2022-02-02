const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const UserManager = require('../classes/UserManager');

module.exports = {
  findUserById,
  findUserByUsername,
  findUserByEmail,
  createUser,
  updateUser,
  makeUsersFriends,
  getUserFriends,
  isUserFriendsWithUsers
};

async function findUserById(id) {
  return await UserModel.findById(id).exec();
}

async function findUserByUsername(username) {
  const user = await UserModel.findOne({
    username: username
  }).exec();

  return user;
}

async function findUserByEmail(email) {
  const user = await UserModel.findOne({
    email: email
  }).exec();

  return user;
}

async function createUser(username, email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  let newUser = new UserModel({
    username: username,
    email: email,
    passwordHash: passwordHash
  });

  return await newUser.save();
}

async function updateUser(userId, username, password) {
  const user = await this.findUserById(userId);

  if(!user) {
    throw new Error("Cannot find user to update.");
  }

  user.username = username;
  const passwordHash = await bcrypt.hash(password, 10);
  user.passwordHash = passwordHash;

  await user.save();
}

async function addUserAsFriend(userId, friendId) {
  const userUpdateResult = await UserModel.updateOne({
    _id: userId
  },
  {
    $addToSet: {
      friends: friendId
    }
  }).exec();

  return userUpdateResult.modifiedCount === 1;
}

async function makeUsersFriends(firstUserId, secondUserId) {
  const firstUserUpdateSuccess = await addUserAsFriend(firstUserId, secondUserId);

  const secondUserUpdateSuccess = await addUserAsFriend(secondUserId, firstUserId);

  return firstUserUpdateSuccess && secondUserUpdateSuccess;
}

async function getUserFriends(userId, searchValue = null) {
  const populateConfig = {
    path: "friends"
  };

  if(searchValue) {
    populateConfig["match"] = {
      username: new RegExp("^" + searchValue)
    };
  }

  const user = await UserModel.findById(userId)
                              .populate(populateConfig)
                              .exec();

  let friends = user.friends;
  friends = friends.map((friend) => {
    let friendObject = friend.toObject();
    
    let friendObjectWhitelisted = {};
    friendObjectWhitelisted.id = friendObject._id.toString();
    friendObjectWhitelisted.email = friendObject.email;
    friendObjectWhitelisted.username = friendObject.username;
    friendObjectWhitelisted.status = UserManager.getUserStatus(friendObject._id.toString());

    return friendObjectWhitelisted;
  });

  return friends;
}

async function isUserFriendsWithUsers(userId, userIds) {
  const friends = await getUserFriends(userId);

  const friendIds = friends.map(friend => friend.id);

  for(let i = 0; i < userIds.length; i++) {
    if(!friendIds.includes(userIds[i])) {
      return false;
    }
  }

  return true;
}