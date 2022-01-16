var express = require('express');
var router = express.Router();
const expressJwt = require('express-jwt');
const JwtConfig = require('../config/jwtConfig');

var chatController = require('../controllers/chatController');

router.post('/',
            expressJwt(JwtConfig.expressJwtConfig),
            chatController.createChat);

router.get('/',
           expressJwt(JwtConfig.expressJwtConfig),
           chatController.getUserChats);

router.get('/:chatId',
           expressJwt(JwtConfig.expressJwtConfig),
           chatController.getChat);

module.exports = router;
