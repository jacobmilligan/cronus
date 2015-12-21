'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
		res.locals.displayFooter = true;
		if ( req.session.user ) {
			console.log(req.session.user);
			res.render('index', { loggedIn: true });
		} else {
			res.render('index', { loggedIn: false });
		}
});

module.exports = router;
