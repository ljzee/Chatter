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
    body('email')
      .trim()
      .isEmail()
      .withMessage('Invalid email')
      .toLowerCase(),
    body('password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .withMessage('Password must have minimum eight characters, at least one uppercase letter, one lowercase letter and one number.'),
    ValidationHelper.processValidationResults,
    async (req, res, next) => {
      const {username, email, password} = req.body;

      const userWithUsername = await UserService.findUserByUsername(username);
      const userWithEmail = await UserService.findUserByEmail(email);
      if(userWithUsername || userWithEmail) {
        return res.status(400).json({
          error: "User with the email or username already exists."
        });
      }

      const user = await UserService.createUser(username, email, password);
      const token = jsonwebtoken.sign({
        sub: user.id
      }, JwtConfig.secret);

      return res.json({
        token: token,
        userId: user.id
      });
    }
]
