'use strict';
var index = require('../controllers/index');
var dashboard = require('../controllers/dashboard');
var login = require('../controllers/login');
var register = require('../controllers/register');
var logout = require('../controllers/logout');
var projects = require('../controllers/projects');
var tasks = require('../controllers/tasks');
var active_tasks = require('../controllers/active_tasks');

module.exports = function(app) {
	app.use('/', index);
	app.use('/dashboard', dashboard);
	app.use('/login', login);
	app.use('/register', register);
	app.use('/logout', logout);
	app.use('/projects', projects);
	app.use('/tasks', tasks);
	app.use('/active_tasks', active_tasks);
};
