var express = require('express');
var router = express.Router();

var registrationController = require('../controllers/registrationController');

router.post('/', registrationController.register);

module.exports = router;
