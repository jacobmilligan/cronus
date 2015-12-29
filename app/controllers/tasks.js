'use strict';
var express = require('express');
var router = express.Router();

var model = require('../models/tasks');

router.get('/:project_name', function(req, res, next) {
  model.getTasks([req.session.user.id, req.params.project_name], function(err, result) {
    res.send(result);
  });

});

module.exports = router;
