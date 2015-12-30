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

      var taskAmt = document.getElementById('task-amt');
      taskAmt.value = taskAmt.placeholder = res[0].default_value;
      taskAmt.addEventListener('input', helpers.handleMoney);
      taskAmt.addEventListener('blur', helpers.setDefaultValue);

      if ( res.length > 0 ) {
        var ampm = "am";
        for (var i = 0; i < res.length; i++) {
          var startTime = new Date(res[i].start_time);
          ampm = ( startTime.getHours() > 11 ) ? "pm" : "am";
          res[i].start_time = (startTime.getHours() % 12) + ":" + startTime.getMinutes() + ampm;
          res[i].end_time = (res[i].end_time) ? res[i].end_time : res[i].start_time;
          container.innerHTML += Handlebars.templates['task.hbs'](res[i]) + "<br>";
        }

        var tasks = document.getElementsByClassName('task');
        var hours, minutes, seconds, valueNum, totalAmt = 0;
        var valueTxt = '';
        var projectName, projectColor;
        //Set each project labels text color based on the label color itself
        for ( i = 0; i < tasks.length; i++ ) {
          projectName = tasks[i].getElementsByClassName('task-project-name')[0];
          projectColor = helpers.rgbToHex(window.getComputedStyle(projectName).getPropertyValue('background-color'));
          projectName.style.color = ( projectColor > 0xffffff/2) ? '#272727' : '#F8F8F8'; //Sets text color based off contrast with label color

          hours = Number(tasks[i].getElementsByClassName('hours')[0].innerHTML);
          minutes = Number(tasks[i].getElementsByClassName('minutes')[0].innerHTML);
          seconds = Number(tasks[i].getElementsByClassName('seconds')[0].innerHTML);
          valueTxt = tasks[i].getElementsByClassName('task-value')[0].innerHTML.replace('per hour', '');
          valueNum = Number(valueTxt.replace('$', ''));
          totalAmt = (hours * valueNum) + ( (minutes / 60) * valueNum ) + ( seconds * ( (valueNum/60) / 60 ) ); //calculate total amount billable
          tasks[i].getElementsByClassName('total-time')[0].innerHTML = '$' + totalAmt.toFixed(2);
        }

      } else {
        container.innerHTML = "There are no tasks";
      }

    }
  };

  req.open('GET', '/tasks/' + params);
  req.send();
}
