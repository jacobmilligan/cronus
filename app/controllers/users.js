'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if ( !req.session.user ) {
		res.redirect('/login');
	} else {
		res.render('users', {name: req.session.user.first_name});
	}
});

module.exports = router;
