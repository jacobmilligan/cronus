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
	projectModel.sendProjects(req.session.user, req.body, function(err, success) {
		//this return 500 error for some reason. Fix plz
	});
});

module.exports = router;