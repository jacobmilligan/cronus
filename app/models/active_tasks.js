'use strict';

var db = require('./db');

function setRunning(params, callback) {
  var sql = "INSERT INTO active_tasks (user_id, task_name, project_name, value, start_time) VALUES ($1, $2, $3, $4, $5)";
  db.query(sql, params, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, true);
    }
  });
}

module.exports = {
  setRunning: setRunning
};
