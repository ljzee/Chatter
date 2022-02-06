var express = require('express');
var router = express.Router();
const expressJwt = require('express-jwt');
const JwtConfig = require('../config/jwtConfig');

var uploadController = require('../controllers/uploadController');

router.post('/',
           expressJwt(JwtConfig.expressJwtConfig),
           uploadController.uploadImage);

module.exports = router;