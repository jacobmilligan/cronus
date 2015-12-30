'use strict';
var db = require('./db');

function getProjects(id, callback) {
	var sql = "SELECT * FROM projects WHERE user_id = $1";
	db.query(sql, [id], function(err, result) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, result.rows);
		}
	});
}

function addProjects(body, callback) {
	var sql = "INSERT INTO projects (project_name, user_id, description, default_value, color) VALUES ($1, $2, $3, $4, $5)";
	db.query(sql, body, function(err, result)  {
		if (err) {
			return callback(err);
		} else {
			return callback(null, true);
		}
	});
}

function getColor(params, callback) {
	var sql = "SELECT color FROM projects WHERE user_id = $1 AND project_name = $2";
	db.query(sql, params, function(err, result) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, result.rows[0].color);
		}
	});
}

module.exports = {
	getProjects: getProjects,
	addProjects: addProjects,
	getColor: getColor
};
