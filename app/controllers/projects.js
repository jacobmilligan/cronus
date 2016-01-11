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
	model.addProjects(dataToInsert, function(err, success) {
		if (err) {
			res.send(err);
		} else {
			res.send(success);
		}
	});
});

router.put('/', function(req, res, next) {
	var data = [];
	if ( req.body.title === req.body.original ) {
		data = [req.body.description, req.body.value, req.session.user.id, req.body.original];
		model.editExisting(data, function(err, success) {
			if (err) {
				res.send(err);
			} else {
				res.send(success);
			}
		});
	} else {
		data = [req.body.value, req.body.title, req.body.description, req.session.user.id, req.body.original, req.body.color];
		model.editProjects(data, function(err, success) {
			if (err) {
				res.send(err);
			} else {
				res.send("Success");
			}
		});
	}
});

router.delete('/', function(req, res, next) {
	var data = [req.body.project_name, req.session.user.id];
	model.deleteProject(data, function(err, success) {
		if (err) {
			res.send(err);
		}
		return;
	});
});

module.exports = router;
