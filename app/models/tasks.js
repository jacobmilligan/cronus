'use strict';

var db = require('./db');

function getTasks(params, callback) {
  var sql = "SELECT * FROM tasks WHERE user_id = $1 AND project_name = $2";
  console.log(id);
  db.query(sql, params, function(err, result) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, result.rows);
    }
  });
}

module.exports = {
  getTasks: getTasks
};
