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


module.exports = {
	query: query
};