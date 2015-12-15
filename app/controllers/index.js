'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if ( req.session.first_name ) {
		res.redirect('/users');
	} else {
		res.render('index', { title: "Cronus" });
	}
});

module.exports = router;
