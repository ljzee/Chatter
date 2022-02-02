const UserService = require('../services/userService');
const ValidationHelper = require('./validationHelper');
const {body} = require("express-validator");

exports.updateUser = [
    body('username')
      .trim()
      .isLength({ min: 8 })
      .withMessage('Username must have minimum eight characters.')
      .toLowerCase(),
    body('password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .withMessage('Password must have minimum eight characters, at least one uppercase letter, one lowercase letter and one number.'),
    ValidationHelper.processValidationResults,
    async (req, res, next) => {
        try{
            const {username, password} = req.body;

            const userWithUsername = await UserService.findUserByUsername(username);
            if(userWithUsername) {
                return res.status(400).json({
                    error: "Username is already taken."
                });
            }

            await UserService.updateUser(req.user.sub, username, password);

            return res.sendStatus(200);
        } catch(error) {
            next(error);
        }
    }
]
