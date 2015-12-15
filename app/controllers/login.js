'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/login');

router.get('/', function(req, res, next) {
	console.log(req.session);
	if ( req.session.user ) {
		res.redirect('/users');
	} else {
		res.render('login');
	}
});

router.post('/', function(req, res, next) {
	db(req.body.email, req.body, function(err, user) {
		if (err) {
			return next(err);
		}
		if ( user === 'pwd' ) {
			res.render('login', {msg: "Incorrect Password"});
		} else if (!user) {
			res.render('login', {msg: "No such user"});
		} else {
			//Log session
			req.session.user = user;
			req.session.cookie.maxAge = 60000 * 30; //30 mins

			res.redirect('/users');
		}
	})
});

module.exports = router;