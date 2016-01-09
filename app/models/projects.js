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
	var sql = "SELECT color, default_value FROM projects WHERE user_id = $1 AND project_name = $2";
	db.query(sql, params, function(err, result) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, result.rows[0]);
		}
	});
}

function editProjects(attrs, callback) {
	var sql = ["UPDATE tasks SET project_name = $1 WHERE user_id = $2 AND project_name = $3",
						"UPDATE active_tasks SET project_name = $1 WHERE user_id = $2 AND project_name = $3",
						"UPDATE projects SET default_value = $1, project_name = $2, description = $3 WHERE user_id = $4 AND project_name = $5"];
	var params = [attrs[1], attrs[3], attrs[4]];
	console.log(params);
	db.query(sql[2], attrs, function(err, result) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, true);
		}
	});
}

module.exports = {
	getProjects: getProjects,
	addProjects: addProjects,
	editProjects: editProjects,
	getColor: getColor
};
