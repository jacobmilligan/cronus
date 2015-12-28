'use strict';

var db = require('./db');

function getTasks(id, callback) {
  var sql = "SELECT * FROM tasks WHERE user_id = $1";
  db.query(sql, id, function(err, result) {
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
