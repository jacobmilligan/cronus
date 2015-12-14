'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/login');

router.get('/', function(req, res, next) {
	res.render('login');
	return
});

router.post('/', function(req, res, next) {

});

module.exports = router;