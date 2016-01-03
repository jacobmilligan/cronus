'use strict';
var express = require('express');
var router = express.Router();

var model = require('../models/active_tasks');

router.get('/', function(req, res, next) {
  model.getRunning([req.session.user.id], function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.post('/', function(req, res, next) {
  var body = req.body;
  var data = [req.session.user.id, body.task_name, body.project_name, body.value, body.start_time];
  model.setRunning(data, function(err, success) {
    if (success) {
      res.send("Success");
    }
  });
});

router.delete('/', function(req, res, next) {
  
});

module.exports = router;