const UserService = require('../services/userService');
const jsonwebtoken = require('jsonwebtoken');
const JwtConfig = require('../config/jwtConfig');
const bcrypt = require('bcrypt');
const ValidationHelper = require('./validationHelper');
const {body} = require("express-validator");

exports.authenticate = [
    body('username')
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .toLowerCase(),
    body('password')
      .notEmpty()
      .withMessage("Password is required"),
    ValidationHelper.processValidationResults,
    async (req, res, next) => {
      const {username, password} = req.body;

      let user = await UserService.findUserByUsername(username);
      if(!user) {
        user = await UserService.findUserByEmail(username);
      }

      if(!user) {
        return res.status(400).json({
          error: "Username or password is incorrect."
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
      if(!isPasswordCorrect) {
        return res.status(400).json({
          error: "Username or password is incorrect."
        });
      }

      const token = jsonwebtoken.sign({
        sub: user.id
      }, JwtConfig.secret);

      return res.json({
        token: token,
        userId: user.id
      });
    }
]
