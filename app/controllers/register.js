'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/register');
var bcrypt = require('bcryptjs');

/* Retreive page. */
router.get('/', function(req, res, next) {
	res.locals.displayFooter = false;
	res.locals.title = "Register account";
	res.locals.msg = req.session.msg;
	res.render('register', {error: false, csrfToken: req.csrfToken});
});

// Create user
router.post('/', function(req, res, next) {
	db(req.body, function(err, user) {
		if (err) {
			req.flash('msg', err);
			req.session.msg = req.flash('msg');
			req.session.frmmail = req.body.email;
			req.session.firstName = req.body.first_name;
			req.session.lastName = req.body.last_name;
			res.redirect('register');
		} else {
			res.redirect('login');
		}
	});
});

module.exports = router;