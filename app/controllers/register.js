'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/register');
var bcrypt = require('bcryptjs');

/* Retreive page. */
router.get('/', function(req, res, next) {
	res.locals.displayFooter = false;
	res.locals.title = "Register account";
	res.render('register', {error: false, csrfToken: req.csrfToken});
});

// Create user
router.post('/', function(req, res, next) {
	db(req.body, function(err, user) {
		if (err) {
			req.flash('msg', err);
			res.locals.msg = req.flash('msg');
			res.locals.email = req.body.email;
			res.locals.firstName = req.body.first_name;
			res.locals.lastName = req.body.last_name;
			res.render('register', {'csrfToken': req.csrfToken});
		} else {
			res.redirect('login');
		}
	});
});

module.exports = router;