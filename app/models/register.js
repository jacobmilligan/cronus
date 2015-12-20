'use strict';

var db = require('./db');
var validate = require('../helpers/validation');

function createUser(postBody, callback) {
	var body = [];
	var errStr = "";
	// make body into array
	for ( var key in postBody ) {
		if ( key != '_csrf' ) {
			body.push(postBody[key]);
		}
	}

	errStr = validate.register(postBody);

	if ( errStr.length > 0 ) {
		return callback(errStr);
	}

	var sql = "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)";

	if ( body.length < 4 ) {
		sql = "";
	}

	db.query(sql, body, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, body);
	});

}

module.exports = createUser;