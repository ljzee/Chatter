const UserService = require('../services/userService');
const jsonwebtoken = require('jsonwebtoken');
const JwtConfig = require('../config/jwtConfig');
const ValidationHelper = require('./validationHelper');
const {body} = require("express-validator");

exports.register = [
    body('username')
      .trim()
      .isLength({ min: 8 })
      .withMessage('Username must have minimum eight characters')
      .toLowerCase(),
    body('password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .withMessage('Password must have minimum eight characters, at least one uppercase letter, one lowercase letter and one number.'),
    ValidationHelper.processValidationResults,
    async (req, res, next) => {
      const {username, password} = req.body;

      const userWithUsername = await UserService.findUserByUsername(username);
      if(userWithUsername) {
        return res.status(400).json({
          error: "Username is already taken."
        });
      }

      const user = await UserService.createUser(username, password);
      const token = jsonwebtoken.sign({
        sub: user.id
      }, JwtConfig.secret);

      return res.json({
        token: token,
        userId: user.id,
        username: user.username,
        profileImageFilename: user.profileImageFilename
      });
    }
]
