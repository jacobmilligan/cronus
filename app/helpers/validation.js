'use strict';

var joi = require('joi');

// Setup validation schemas
var registerSchema = joi.object().keys({
	_csrf: joi.string(),
	email: joi.string().email(),
  	password: joi.string().min(6),
  	first_name: joi.string(),
  	last_name: joi.string().allow('')
});

var loginSchema = joi.object().keys({
	_csrf: joi.string(),
	email: joi.string().email(),
	password: joi.string().min(6),
	remember: joi.any().optional()
});

function login(val) {
	var errStr = "";
	joi.validate(val, loginSchema, function(err, result) {
		if (err) {
			errStr = err.details[0].message;
			switch (err.details[0].path) {
				case "email":
					errStr = errStr.replace("\"email\"", "Email Address");
					break;
				case "password":
					errStr = errStr.replace("\"password\"", "Password");
					break;
			}
		}
	});
	return errStr;
}

function register(val) {
	var errStr = "";
	joi.validate(val, registerSchema, function(err, result) {
		if (err) {
			errStr = err.details[0].message;
			switch (err.details[0].path) {
				case "email":
					errStr = errStr.replace("\"email\"", "Email Address");
					break;
				case "password":
					errStr = errStr.replace("\"password\"", "Password");
					break;
				case "first_name":
					errStr = errStr.replace("\"first_name\"", "First Name");
					break;
				case "last_name":
					errStr = errStr.replace("\"last_name\"", "Last Name");
					break;
			}
		}
	});
	return errStr;
}

module.exports = {
	register: register,
	login: login
};
