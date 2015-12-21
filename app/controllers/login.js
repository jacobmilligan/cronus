'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/login');

router.get('/', function(req, res, next) {
	if ( req.session.user ) {
		res.redirect('/users');
	} else {
		res.locals.displayFooter = false;
		res.render('login', {csrfToken: req.csrfToken});
	}
});

router.post('/', function(req, res, next) {
	db(req.body.email, req.body, function(err, user) {
		if (err) {
			req.flash('msg', err);
			res.locals.msg = req.flash('msg');
			res.locals.email = req.body.email;
			res.render('login', {'csrfToken': req.csrfToken});
		} else if ( user === 'pwd' ) {
			req.flash('msg', "Incorrect password");
			res.locals.msg = req.flash('msg');
			res.locals.email = req.body.email;
			res.render('login', {'csrfToken': req.csrfToken});
		} else if (!user) {
			req.flash('msg', "No such user");
			res.locals.msg = req.flash('msg');
			res.locals.email = req.body.email;
			res.render('login', {'csrfToken': req.csrfToken});
		} else {
			//Log session
			delete user.password;
			req.session.user = user;
			req.session.cookie.maxAge = 60000 * 30; //30 mins
			res.redirect('/users');
		}
	});
});

module.exports = router;