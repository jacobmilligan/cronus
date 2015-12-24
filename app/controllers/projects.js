'use strict';
var express = require('express');
var router = express.Router();

var projectModel = require('../models/projects');


/* GET home page. */
router.get('/', function(req, res, next) {
	projectModel.getProjects(req.session.user.id, function(err, projects) {
			res.send(projects);
		});
});

router.post('/', function(req, res, next) {
	console.log(req.body);
});

module.exports = router;