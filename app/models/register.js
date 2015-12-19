'use strict';

var db = require('./db');

function createUser(postBody, callback) {
	var body = [];
	var errStr = "";
	// make body into array
	for ( var key in postBody ) {
		if ( postBody[key].length <= 0 ) {
			errStr += key + " is required.\n";
		}
		if ( key > 0 ) {
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
			return callback(err);
		}

		return callback(null, body);
	});
}

module.exports = createUser;