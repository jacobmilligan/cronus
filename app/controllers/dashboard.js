'use strict';
var express = require('express');
var router = express.Router();

/* GET dashboard listing. */
router.get('/', function(req, res, next) {
	res.redirect('dashboard/projects');
});

router.get('/projects', function(req, res, next) {
	if ( !req.session.user ) {
		res.redirect('/login');
	} else {
		res.locals.displayFooter = true;
		res.render('dashboard/projects', {name: req.session.user.first_name, csrfToken: req.csrfToken});
	}
});

router.get('/tasks', function(req, res, next) {
  res.render('dashboard/tasks', {});
});

module.exports = router;
