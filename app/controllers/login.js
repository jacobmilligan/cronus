'use strict';
var express = require('express');
var router = express.Router();

var db = require('../models/login');

router.get('/', function(req, res, next) {
	if ( req.session.user ) {
		res.redirect('/dashboard');
	} else {
		res.locals.displayFooter = false;
		res.render('login', {csrfToken: req.csrfToken, 'msg': req.session.msg, 'msg-color': req.session.msgColor});
		delete req.session.msg;
		delete req.session.msgColor;
	}
});

router.post('/', function(req, res, next) {
	db(req.body.email, req.body, function(err, user) {
		req.session.msgColor = '#CC4C37';
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
			if ( req.body.remember === 'on' ) {
				req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //One month
			} else {
				req.session.cookie.maxAge = 20 * 60 * 1000; // 20 minutes
			}
			res.redirect('/dashboard');
		}
	});
});

module.exports = router;
