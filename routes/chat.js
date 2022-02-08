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

router.post('/:chatId/message',
            expressJwt(JwtConfig.expressJwtConfig),
            chatController.sendMessage);

router.get('/:chatId/participants/status',
           expressJwt(JwtConfig.expressJwtConfig),
           chatController.getParticipantsStatus);

module.exports = router;
