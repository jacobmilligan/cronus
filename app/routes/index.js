'use strict';
var db = require('../models/db');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
			title: "Cronus"
		}
	);
});

module.exports = router;
