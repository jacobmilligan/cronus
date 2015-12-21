'use strict';
var db = require('./db');
var bcrypt = require('bcryptjs');
var validate = require('../helpers/validation');

function selectByEmail(email, body, callback) {
	var errStr = validate.login(body);
	if ( errStr.length > 0 ) {
		return callback(errStr);
	}

	var sql = 'SELECT * FROM users WHERE email = $1';
	db.query(sql, [email], function(err, result) {
		if (err) {
			return callback(err);
		}
		if ( result.rowCount === 0 ) {
			callback(null, result.rows[0]);
		} else if ( bcrypt.compareSync(body.password, result.rows[0].password) ) {
			callback(null, result.rows[0]);
		} else {
			callback(null, 'pwd');
		}

	});
}

module.exports = selectByEmail;