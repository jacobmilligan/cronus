'use strict';

var helpers = require('./helpers');
require('../templates');

(function() {
  var url = window.location.href;
  if ( url.indexOf('tasks') > -1 ) {
    getTasks();
  }
}());

function getTasks() {
  var req = new XMLHttpRequest();
  var url = window.location.href;
  var params = url.substring(url.lastIndexOf('/') + 1);
  var loader = document.getElementsByClassName('loader')[0];
  var container = document.getElementsByClassName('container')[0];

  req.onreadystatechange = function() {
    if ( req.readyState === 4 && req.status === 200 ) {
      var res = JSON.parse(req.responseText);
      loader.style.display = 'none';

      if ( res.length > 0 ) {
        var ampm = "am";
        for (var i = 0; i < res.length; i++) {
          var startTime = new Date(res[i].start_time);
          ampm = ( startTime.getHours() > 11 ) ? "pm" : "am";
          res[i].start_time = (startTime.getHours() % 12) + ":" + startTime.getMinutes() + ampm;
          res[i].end_time = (res[i].end_time) ? res[i].end_time : res[i].start_time;
          console.log(res[i].color);
          container.innerHTML += Handlebars.templates['task.hbs'](res[i]) + "<br>";
        }

      } else {
        container.innerHTML = "There are no tasks";
      }

    }
  };

  req.open('GET', '/tasks/' + params);
  req.send();
}