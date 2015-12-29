'use strict';

var db = require('./db');

function getTasks(params, callback) {
  var sql = "SELECT t.*, p.color FROM tasks t " +
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
        result.rows[i].elapsed.seconds = (seconds) ? seconds : '00';
        result.rows[i].elapsed.minutes = (minutes) ? minutes : '00';
        result.rows[i].elapsed.hours = (hours) ? hours : '00';

        result.rows[i].color = '#' + result.rows[i].color;
      }
      return callback(null, result.rows);
    }
  });
}

module.exports = {
  getTasks: getTasks
};
