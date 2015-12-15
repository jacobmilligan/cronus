'use strict';

var db = require('./db');

function createUser(postBody, callback) {
	var body = [];
	var errStr = "";
	for ( var key in postBody ) {
		body.push(postBody[key]);
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