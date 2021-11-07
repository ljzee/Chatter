var express = require('express');
var router = express.Router();

var authenticationController = require('../controllers/authenticationController');

router.post('/', authenticationController.authenticate);

module.exports = router;
