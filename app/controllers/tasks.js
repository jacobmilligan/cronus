'use strict';
var express = require('express');
var router = express.Router();

var model = require('../models/tasks');

router.get('/:project_name', function(req, res, next) {
  model.getTasks([req.session.user.id, req.params.project_name], function(err, result) {
    res.send(result);
  });

});

router.post('/', function(req, res, next) {
  var data = [req.body.task_name, req.body.project_name, req.session.user.id,
    req.body.description, req.body.value, req.body.start_time, req.body.end_time,
    req.body.elapsed];
  console.log(data);

  model.insertTask(data, function(err, success) {
    if (success) {
      res.send(true);
    }
  });
});

module.exports = router;
