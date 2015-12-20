'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/register');
var bcrypt = require('bcryptjs');

/* Retreive page. */
router.get('/', function(req, res, next) {
	if ( req.session.error ) {
		res.render('register', {error: req.session.error, msg: req.session.msg, csrfToken: req.csrfToken});
		delete req.session.error;
		delete req.session.msg;
	} else {
		res.render('register', {error: false, csrfToken: req.csrfToken});
	}
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