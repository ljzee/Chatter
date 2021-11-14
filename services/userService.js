const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

module.exports = {
  findUserById,
  findUserByUsername,
  findUserByEmail,
  createUser,
  makeUsersFriends
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
