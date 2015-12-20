'use strict';

var db = require('./db');
var validate = require('../helpers/validation');
var bcrypt = require('bcryptjs');

function createUser(postBody, callback) {
	var body = [];
	var errStr = "";
	errStr = validate.register(postBody);
	postBody.password = (postBody.password.length > 6) ? bcrypt.hashSync(postBody.password, bcrypt.genSaltSync(10)) : "";
	// make body into array
	for ( var key in postBody ) {
		if ( key != '_csrf' ) {
			body.push(postBody[key]);
		}
	}

	
	if ( errStr.length > 0 ) {
		return callback(errStr);
	}

	var sql = "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)";

	if ( body.length < 4 ) {
		sql = "";
	}

	db.query(sql, body, function(err, result) {
		if (err) {
			var dbErr;
			switch(err.constraint) {
				case ( 'users_email_key' ) :
					dbErr = "That email address already exists";
					break;
			}
			return callback(dbErr);
		}
		return callback(null, body);
	});

}

module.exports = createUser;