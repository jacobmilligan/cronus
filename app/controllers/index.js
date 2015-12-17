'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.csrfToken);
	
		res.render('index', { loggedIn: res.locals.loggedIn });
});

module.exports = router;
