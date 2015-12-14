'use strict';
var pg = require('pg');

var DB_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/cronus';

function query(sql, param, callback) {
	pg.connect(DB_URL, function(err, client, done) {
		if (err) {
			done();
			callback(err);
			return;
		}
		client.query(sql, param, callback);
	});
}

function selectById(id, callback) {
	var sql = 'SELECT * FROM users WHERE id = $1';
	query(sql, [id], function(err, result) {
		if (err) {
			return callback(err);
		}
		callback(null, result.rows[0]);
	});
}


module.exports = {
	selectById: selectById
};