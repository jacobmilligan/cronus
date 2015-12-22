'use strict';
var express = require('express');
var router = express.Router();

/* GET dashboard listing. */
router.get('/', function(req, res, next) {
	if ( !req.session.user ) {
		res.redirect('/login');
	} else {
		res.locals.displayFooter = true;
		res.render('dashboard', {name: req.session.user.first_name});
	}
});

module.exports = router;
