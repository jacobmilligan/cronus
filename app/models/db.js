'use strict';
var pg = require('pg');

var DB_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/cronus';

function query(sql, paramArray, callback) {
	pg.connect(DB_URL, function(err, client, done) {
		if (err) {
			done();
			callback(err);
			return;
		}
		client.query(sql, paramArray, callback);
		done();
	});
}

function rollback(client, done) {
	client.query('ROLLBACK', function(err) {
		if (err) {
			return done(err); //serious problems exist if rollback returns here
		}
	});
	done();
}

module.exports = {
	query: query,
	rollback: rollback
};
