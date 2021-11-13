var express = require('express');
var router = express.Router();
const expressJwt = require('express-jwt');
const JwtConfig = require('../config/jwtConfig');

var friendRequestController = require('../controllers/friendRequestController');

router.post('/',
            expressJwt(JwtConfig.expressJwtConfig),
            friendRequestController.processRequest);

router.get('/',
            expressJwt(JwtConfig.expressJwtConfig),
            friendRequestController.getPendingRequests);

router.delete('/:requestId',
              expressJwt(JwtConfig.expressJwtConfig),
              friendRequestController.deletePendingRequest);

module.exports = router;
