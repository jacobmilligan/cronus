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
  var data = [req.session.user.id, body.task_name, body.project_name, body.value, body.start_time, body.color];
  model.setRunning(data, function(err, success) {
    if (err) {
      res.send(err);
    } else {
      res.send(success);
    }
  });
});

router.delete('/', function(req, res, next) {
  model.deleteRunning([req.session.user.id], function(err, success) {
    if (err) {
      res.send(err);
    } else {
      res.send(success);
    }
  });
});

router.put('/', function(req, res, next) {
  model.updateRunning([req.body.task_name, req.body.value, req.session.user.id], function(err, success) {
    if (err) {
      res.send(err);
    } else {
      res.send(success);
    }
  });
});

module.exports = router;
