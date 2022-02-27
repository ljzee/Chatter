var express = require('express');
var router = express.Router();
const expressJwt = require('express-jwt');
const JwtConfig = require('../config/jwtConfig');

var chatController = require('../controllers/chatController');

router.post('/',
            expressJwt(JwtConfig.expressJwtConfig),
            chatController.createChat);

router.delete('/:chatId',
              expressJwt(JwtConfig.expressJwtConfig),
              chatController.leaveChat);

router.get('/',
           expressJwt(JwtConfig.expressJwtConfig),
           chatController.getUserChats);

router.get('/:chatId',
           expressJwt(JwtConfig.expressJwtConfig),
           chatController.getChat);

router.get('/:chatId/messages',
           expressJwt(JwtConfig.expressJwtConfig),
           chatController.getMessages)

router.post('/:chatId/message',
            expressJwt(JwtConfig.expressJwtConfig),
            chatController.sendMessage);

router.get('/:chatId/participants/status',
           expressJwt(JwtConfig.expressJwtConfig),
           chatController.getParticipantsStatus);

router.get("/:chatId/participants",
           expressJwt(JwtConfig.expressJwtConfig),
           chatController.getParticipants);

router.post('/:chatId/participants',
            expressJwt(JwtConfig.expressJwtConfig),
            chatController.addChatParticipants)

module.exports = router;
