'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session);
	if ( req.session.user ) {
		res.redirect('/users');
	} else {
		res.render('index', { title: "Cronus" });
	}
});

module.exports = router;
