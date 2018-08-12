var express = require('express');
var router = express.Router();

var home = require('../api-controllers/home-controller/home-controller');

router.route('/').
get(home.get);

module.exports = router;