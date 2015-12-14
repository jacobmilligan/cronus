'use strict';
var db = require('./db');

function selectByEmail(email, body, callback) {
	var sql = 'SELECT * FROM users WHERE email = $1';
	db.query(sql, [email], function(err, result) {
		if (err) {
			return callback(err);
		}
		if ( result.rowCount === 0 ) {
			callback(null, result.rows[0]);
		} else if ( body.password === result.rows[0].password ) {
			callback(null, result.rows[0]);
		} else {
			callback(null, 'pwd');
		}

	});
}

module.exports = selectByEmail;