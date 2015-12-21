'use strict';

var joi = require('joi');

// Setup validation schemas
var registerSchema = joi.object().keys({
	_csrf: joi.string(),
	email: joi.string().email(),
  	password: joi.string().min(6),
  	first_name: joi.string(),
  	last_name: joi.string().allow('')
}).optionalKeys('last_name');

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
					errStr = errStr.replace("\"password\"", "Password") + " and must be at least 6 characters long";
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
	register: register
};
