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
	var sql = ["INSERT INTO projects (default_value, project_name, description, user_id, color) VALUES ($1, $2, $3, $4, $5)",
						"UPDATE tasks SET project_name = $1 WHERE user_id = $2 AND project_name = $3",
						"UPDATE active_tasks SET project_name = $1 WHERE user_id = $2 AND project_name = $3",
						"DELETE FROM projects WHERE user_id = $1 AND project_name = $2",
						"UPDATE projects SET description = $1, default_value = $2 WHERE user_id = $3 AND project_name = $"];
	var params = [attrs[0], attrs[1], attrs[2], attrs[3], attrs[5]];
	db.query(sql[0], params, function(err, result) {
		if (err) {
			return callback(err);
		} else {
			//Update tasks
			params = [attrs[1], attrs[3], attrs[4]];
			db.query(sql[1], params, function(err, result) {
				if (err) {
					return callback(err);
				} else {
					//Update active tasks
					db.query(sql[2], params, function(err, result) {
						if (err) {
							return callback(err);
						} else {
							//Delete old project
							params = [attrs[3], attrs[4]];
							db.query(sql[3], params, function(err, result) {
								if (err) {
									return callback(err);
								} else {
									return callback(null, true);
								}
							});
						}
					}); //End update active tasks
				}
			}); //End update tasks
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

module.exports = {
	getProjects: getProjects,
	addProjects: addProjects,
	editProjects: editProjects,
	editExisting: editExisting,
	getColor: getColor
};
