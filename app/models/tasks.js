'use strict';

var db = require('./db');

function getTasks(params, callback) {
  var sql = "SELECT * FROM tasks WHERE user_id = $1 AND project_name = $2";
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

        //Format timestamp
      }
      return callback(null, result.rows);
    }
  });
}

module.exports = {
  getTasks: getTasks
};
