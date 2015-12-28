'use strict';
var express = require('express');
var router = express.Router();

//var model = require('../models/tasks');

router.get('/', function(req, res, next) {
  res.send({
    jacob: "Hey"
  });
  /*model.getTasks(req.session.user.id, function(err, result) {
    res.send(result);
  });*/
});

module.exports = router;
