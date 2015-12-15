'use strict';
var express = require('express');
var router = express.Router();
var db = require('../models/register');

/* Retreive page. */
router.get('/', function(req, res, next) {
	console.log(req.session);
	res.render('register');
});

// Create user
router.post('/', function(req, res, next) {
	db(req.body, function(err, user) {
		if (err) {
			return next(err);
		}
		res.render('register', {msg: user});
	});
});

module.exports = router;