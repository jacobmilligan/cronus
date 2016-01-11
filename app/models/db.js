'use strict';
var pg = require('pg');
var pgTransaction = require('pg-transaction');

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

function transaction(queries, callback) {

	pg.connect(DB_URL, function(err, client, done) {
		var tx = new pgTransaction(client);
		tx.begin();

		tx.on('error', function(rollErr) {
			tx.rollback();
			if (rollErr) {
				callback(rollErr.detail);
				done();
				return;
			}
		});

		for ( var i = 0; i < queries.length; i++ ) {
			tx.query(queries[i].sql, queries[i].params);
		}

		tx.commit(callback(null));
		done();
		return;

	});

}

module.exports = {
	query: query,
	transaction: transaction
};
