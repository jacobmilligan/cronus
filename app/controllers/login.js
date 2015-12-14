'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/login');

router.get('/login', function(req, res, next) {
	return res.render('login');
});

router.post('/login', function(req, res, next) {
	
});

module.exports = router;