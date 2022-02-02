var express = require('express');
var router = express.Router();
const expressJwt = require('express-jwt');
const JwtConfig = require('../config/jwtConfig');

var userController = require('../controllers/userController');

router.put('/',
           expressJwt(JwtConfig.expressJwtConfig),
           userController.updateUser);

module.exports = router;