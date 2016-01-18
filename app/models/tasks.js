'use strict';

var db = require('./db');

function getTasks(params, callback) {
  var sql = "SELECT t.*, p.color, p.default_value FROM tasks t " +
            "LEFT OUTER JOIN projects p " +
            "ON t.user_id = p.user_id " +
            "WHERE t.user_id = $1 AND t.project_name = $2 AND p.project_name = t.project_name";
  db.query(sql, params, function(err, result) {
    if (err) {
      return callback(err);
    } else {
      var seconds, minutes, hours = 0;
      for (var i = 0; i < result.rows.length; i++) {
        //Elapsed time should appear as zeros rather than null
        seconds = result.rows[i].elapsed.seconds;
        minutes = result.rows[i].elapsed.minutes;
        hours = result.rows[i].elapsed.hours;
        if ( seconds > 0 ) {
          result.rows[i].elapsed.seconds = ( seconds < 10 ) ? '0' + seconds : seconds;
        } else {
          result.rows[i].elapsed.seconds = '00';
        }

        if ( minutes > 0 ) {
          result.rows[i].elapsed.minutes = ( minutes < 10 ) ? '0' + minutes : minutes;
        } else {
          result.rows[i].elapsed.minutes = '00';
        }

        if ( hours > 0 ) {
          result.rows[i].elapsed.hours = ( hours < 10 ) ? '0' + hours : hours;
        } else {
          result.rows[i].elapsed.hours = '00';
        }

        result.rows[i].color = '#' + result.rows[i].color;
      }
      result.rows.sort(function(a, b) {
        return b.start_time - a.start_time;
      });
      return callback(null, result.rows);
    }
  });
}

function insertTask(params, callback) {
  var sql = "INSERT INTO tasks (task_name, project_name, user_id, description, value, start_time, end_time, elapsed) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
            console.log(params);
  db.query(sql, params, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, true);
    }
  });
}

function updateTask(params, callback) {
  var sql = "UPDATE tasks SET task_name = $1 WHERE task_name = $2 AND project_name = $3 AND user_id = $4 AND start_time = $5";
  db.query(sql, params, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, true);
    }
  });
}

module.exports = {
  getTasks: getTasks,
  insertTask: insertTask,
  updateTask: updateTask
};
