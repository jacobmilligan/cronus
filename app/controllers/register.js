'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/register');
var bcrypt = require('bcryptjs');

/* Retreive page. */
router.get('/', function(req, res, next) {
	res.render('register', {csrfToken: req.csrfToken});
});

// Create user
router.post('/', function(req, res, next) {
	req.body.password = (req.body.password.length > 6) ? bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) : "";
	db(req.body, function(err, user) {
		if (err) {
			res.render('register', {error: true, msg: err});
			return next(err);
		}
	});
});

module.exports = router;