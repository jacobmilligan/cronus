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
		body.push(postBody[key]);
	}

	if ( errStr.length > 0 ) {
		return callback(null, errStr);
	}

	var sql = "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)";
	db.query(sql, body, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, body);
	});
}

module.exports = createUser;