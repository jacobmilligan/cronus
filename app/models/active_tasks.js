'use strict';

var db = require('./db');

function setRunning(params, callback) {
  var sql = "INSERT INTO active_tasks (user_id, task_name, project_name, value, start_time, color) VALUES ($1, $2, $3, $4, $5, $6)";
  db.query(sql, params, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, true);
    }
  });
}

function getRunning(id, callback) {
  var sql = "SELECT * FROM active_tasks WHERE user_id = $1";
  db.query(sql, id, function(err, result) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, result.rows);
    }
  });
}

function deleteRunning(id, callback) {
  var sql = "DELETE FROM active_tasks WHERE user_id = $1";
  db.query(sql, id, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, true);
    }
  });
}

function updateRunning(params, callback) {
  var sql = "UPDATE active_tasks SET task_name = $1, value = $2 WHERE user_id = $3";
  db.query(sql, params, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, true);
    }
  });
}

module.exports = {
  setRunning: setRunning,
  getRunning: getRunning,
  deleteRunning: deleteRunning,
  updateRunning: updateRunning
};
