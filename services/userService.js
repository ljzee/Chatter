const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

module.exports = {
  findUserByUsername,
  findUserByEmail,
  createUser
};

async function findUserByUsername(username) {
  const user = await UserModel.findOne({
    $or: [
      {username: username}
    ]
  }).exec();

  return user;
}

async function findUserByEmail(email) {
  const user = await UserModel.findOne({
    $or: [
      {email: email}
    ]
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
