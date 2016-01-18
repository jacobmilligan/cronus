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
	var queries = [{
		sql: "INSERT INTO projects (default_value, project_name, description, user_id, color) VALUES ($1, $2, $3, $4, $5)",
		params: [attrs[0], attrs[1], attrs[2], attrs[3], attrs[5]]
	}, {
		sql: "UPDATE tasks SET project_name = $1 WHERE user_id = $2 AND project_name = $3",
		params: [attrs[1], attrs[3], attrs[4]]
	}, {
		sql: "UPDATE active_tasks SET project_name = $1 WHERE user_id = $2 AND project_name = $3",
		params: [attrs[1], attrs[3], attrs[4]]
	}, {
		sql: "DELETE FROM projects WHERE user_id = $1 AND project_name = $2",
		params: [attrs[3], attrs[4]]
	}];

	db.transaction(queries, function(err, result) {
		if (err) {
			return callback(err, false);
		} else {
			return callback(true);
		}
	});

}

function editExisting(attrs, callback) {
	var sql = "UPDATE projects SET description = $1, default_value = $2 WHERE user_id = $3 AND project_name = $4";
	db.query(sql, attrs, function(err, result) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, true);
		}
	});
}

function deleteProject(data, callback) {
	var queries = [{
		sql: "DELETE FROM active_tasks WHERE project_name = $1 AND user_id = $2",
		params: data
	}, {
		sql: "DELETE FROM tasks WHERE project_name = $1 AND user_id = $2",
		params: data
	}, {
		sql: "DELETE FROM projects WHERE project_name = $1 AND user_id = $2",
		params: data
	}];

	db.transaction(queries, function(err, result) {
		if (err) {
			return callback(err, false);
		} else {
			return callback(null, true);
		}
	});
}

module.exports = {
	getProjects: getProjects,
	addProjects: addProjects,
	editProjects: editProjects,
	editExisting: editExisting,
	deleteProject: deleteProject,
	getColor: getColor
};
