'use strict';
var index = require('../controllers/index');
var users = require('../controllers/users');
var login = require('../controllers/login');

module.exports = function(app) {
	app.use('/', index);
	app.use('/users', users);
	app.use('/login', login);
};