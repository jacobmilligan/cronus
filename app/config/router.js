'use strict';
var index = require('../controllers/index');
var dashboard = require('../controllers/dashboard');
var login = require('../controllers/login');
var register = require('../controllers/register');
var logout = require('../controllers/logout');
var projects = require('../controllers/projects');

module.exports = function(app) {
	app.use('/', index);
	app.use('/dashboard', dashboard);
	app.use('/login', login);
	app.use('/register', register);
	app.use('/logout', logout);
	app.use('/projects', projects);
};