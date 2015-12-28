'use strict';
var express = require('express');
var router = express.Router();

var model = require('../models/projects');

/* GET home page. */
router.get('/', function(req, res, next) {
	model.getProjects(req.session.user.id, function(err, projects) {
			res.send(projects);
		});
});

router.post('/', function(req, res, next) {
	var dataToInsert = [req.body.project_name, req.session.user.id, req.body.description, req.body.default_value, req.body.color];
	console.log(dataToInsert);
	model.addProjects(dataToInsert, function(err, success) {
		if ( err ) {
			res.send(err);
		} else {
			res.send(success);
		}
	});
});

module.exports = router;
