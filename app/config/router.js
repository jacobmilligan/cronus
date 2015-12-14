'use strict';
var index = require('../controllers/index');
var users = require('../controllers/users');

module.exports = function(app) {
	app.use('/', index);
	app.use('/users', users);
};