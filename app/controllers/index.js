'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
		var loggedIn = ( req.session.user ) ? true : false;
		res.render('index', { loggedIn: loggedIn, title: "cronus" });
});

module.exports = router;
