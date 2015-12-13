'use strict';

var pg = require('pg');

var connectionStr = process.env.DATABASE_URL || 'postgres://localhost:5432/cronus';
var client = new pg.Client(connectionStr);
client.connect();
var query = client.query('SELECT * FROM users');
query.on('end', function() {
	client.end();
});