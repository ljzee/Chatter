const UserService = require('../services/userService');
const ChatService = require('../services/chatService');
const ValidationHelper = require('./validationHelper');
const {body} = require("express-validator");
var UserManager = require('../classes/UserManager');

exports.createChat = [
    body('chatName')
        .trim(),
    body('participants')
        .isArray({
            min: 1
        })
        .withMessage("You must select one participant to begin chatting."),
    ValidationHelper.processValidationResults,
    async (req, res, next) => {
        try{ 
            const {chatName, participants} = req.body;
            
            const isUserFriendsWithParticipants = await UserService.isUserFriendsWithUsers(req.user.sub, participants);
            if(!isUserFriendsWithParticipants) {
                return res.status(400).json({
                    error: "You are not friends with one or more participants."
                });
            }

            const chat = await ChatService.createChat(req.user.sub, participants, chatName);

            return res.json({
                chatId: chat._id
            });
        } catch(error) {
            next(error);
        }
    }
]