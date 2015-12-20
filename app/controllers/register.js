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
	req.body.password = (req.body.password.length > 6) ? bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) : "";
	db(req.body, function(err, user) {
		if (err) {
			req.session.error = true;
			req.session.msg = err;
			res.redirect('register');
		} else {
			res.redirect('login');
		}
	});
});

module.exports = router;