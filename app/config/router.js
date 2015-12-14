'use strict';
var index = require('../controllers/index');
var users = require('../controllers/users');
var login = require('../controllers/login');

module.exports = function(app) {
	// Main routes
	app.use('/', index);
	// Users routes
	app.use('/users', users);
	app.use('/login', login);
};