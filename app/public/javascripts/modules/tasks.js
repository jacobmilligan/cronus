'use strict';

var helpers = require('./helpers');
require('../templates');

(function() {
  var url = window.location.href;
  var timer;
  var timeStamp = {};

  if ( url.indexOf('tasks') > -1 ) {
    getTasks();
    var taskControl = document.getElementsByClassName('task-control')[0];
    helpers.detectTouch(taskControl, handleTimer, true);
  }

  //Handles all timer interactions
  function handleTimer(event) {
    if ( timeStamp.start ) {
      timeStamp.end = new Date();
    } else {
      timeStamp.start = new Date();
    }

    var seconds = document.getElementById('seconds');
    var minutes = document.getElementById('minutes');
    var hours = document.getElementById('hours');
    var secondsNum, minutesNum, hoursNum = 0;
    var container = document.getElementsByClassName('container')[0];
    if ( document.getElementsByClassName('active-timer').length === 0 ) {
      document.getElementById('stopwatch').className = 'active-timer';
      event.target.className = 'task-control stop';
      timer = window.setInterval(function() {

        secondsNum = Number(seconds.innerHTML);
        secondsNum++;
        seconds.innerHTML = ( secondsNum < 10 ) ? '0' + secondsNum : secondsNum;
        if ( secondsNum >= 60 ) {
          seconds.innerHTML = '00';
          minutesNum = Number(minutes.innerHTML);
          minutesNum++;
          minutes.innerHTML = ( minutesNum < 10 ) ? '0' + minutesNum : minutesNum;

          if ( minutesNum >= 60 ) {
            minutes.innerHTML = '00';
            hoursNum = Number(hours.innerHTML);
            hoursNum++;
            hours.innerHTML = ( hoursNum < 10 ) ? '0' + hoursNum : hoursNum;
          }

        }
      }, 1000);
    } else {
      var projectName = document.getElementById('project-name').innerHTML;
      var startAMPM = ( timeStamp.start.getHours() > 11 ) ? "pm" : "am";
      var endAMPM = ( timeStamp.end.getHours() > 11 ) ? "pm" : "am";
      var newTask = {
        task_name: document.getElementById('task-name').value,
        project_name: projectName.substring(projectName.indexOf('\"') + 1, projectName.lastIndexOf('\"')),
        value: document.getElementById('task-amt').value,
        elapsed: {
          hours: document.getElementById('hours').innerHTML,
          minutes: document.getElementById('minutes').innerHTML,
          seconds: document.getElementById('seconds').innerHTML
        },
        start_time: ( timeStamp.start.getHours() % 12 ) + ":" + timeStamp.start.getMinutes() + startAMPM,
        end_time: ( timeStamp.end.getHours() % 12 ) + ":" + timeStamp.end.getMinutes() + endAMPM,
        color: "#" + document.getElementById('project-name').className
      };

      if ( newTask.task_name === "" ) {
        newTask.task_name = "(No description)";
      }
      container.innerHTML = Handlebars.templates['task.hbs'](newTask) + "<br>" + container.innerHTML;
      document.getElementsByClassName('task-project-name')[0].style.color = helpers.computeContrast(newTask.color);
      document.getElementById('stopwatch').className = '';
      event.target.className = 'task-control play';
      window.clearInterval(timer);
    }
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
      taskAmt.addEventListener('focus', function(event) {
        if ( event.target.value === event.target.placeholder ) {
          event.target.value = "";
        }
      });

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
          projectName.style.color = helpers.computeContrast(projectColor);

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
