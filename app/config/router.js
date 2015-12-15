'use strict';
var index = require('../controllers/index');
var users = require('../controllers/users');
var login = require('../controllers/login');
var register = require('../controllers/register');
var logout = require('../controllers/logout');

module.exports = function(app) {
	app.use('/', index);
	app.use('/users', users);
	app.use('/login', login);
	app.use('/register', register);
	app.use('/logout', logout);
};