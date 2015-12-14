'use strict';
var db = require('../models/db');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	db.selectById(1, function(err, user) {
		if (err) {
			return next(err);
		}
		res.render('index', {
			name: user.first_name + " " + user.last_name,
			title: "Cronus"
			}
		);
	});
});

module.exports = router;
