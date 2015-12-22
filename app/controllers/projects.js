'use strict';
var express = require('express');
var router = express.Router();

var projectModel = require('../models/projects');


/* GET home page. */
router.get('/', function(req, res, next) {
	projectModel.getProjects(req.session.user.id, function(err, projects) {
			console.log(projects);
			res.send(projects);
		});
});

module.exports = router;