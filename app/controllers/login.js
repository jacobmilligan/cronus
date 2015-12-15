'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/login');

router.get('/', function(req, res, next) {
	res.render('login');
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
			req.session.first_name = user.first_name;
			res.redirect('/users');
		}
	})
});

module.exports = router;