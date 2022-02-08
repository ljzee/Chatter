var express = require('express');
var router = express.Router();
const expressJwt = require('express-jwt');
const JwtConfig = require('../config/jwtConfig');

var friendController = require('../controllers/friendController');

router.get('/',
            expressJwt(JwtConfig.expressJwtConfig),
            friendController.getFriends);

router.delete('/:friendId',
              expressJwt(JwtConfig.expressJwtConfig),
              friendController.removeFriend);

module.exports = router;
