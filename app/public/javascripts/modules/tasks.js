'use strict';

var helpers = require('./helpers');
require('../templates');

(function() {
  var url = window.location.href;
  var timer;
  var timeStamp = {};

  if ( url.indexOf('tasks') > -1 ) {
    document.getElementById('timer-project-inner').style.color = helpers.computeContrast(document.getElementById('hidden-color').value);
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

      //Send new active timer to DB
      addActive(timeStamp.start);
      //start timer
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
      window.clearInterval(timer);

      var projectName = document.getElementById('project-name').innerHTML;
      var startAMPM = ( timeStamp.start.getHours() > 11 ) ? "pm" : "am";
      var endAMPM = ( timeStamp.end.getHours() > 11 ) ? "pm" : "am";

      //Object containing task data to send to template
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
        color: "#" + document.getElementById('hidden-color').value
      };

      if ( newTask.task_name === "" ) {
        newTask.task_name = "(No description)";
      }
      container.innerHTML = Handlebars.templates['task.hbs'](newTask) + "<br>" + container.innerHTML;
      var latestTask = document.getElementsByClassName('task')[0];
      document.getElementsByClassName('total-time')[0].innerHTML = calcTotal(latestTask, 2);
      newTask.start_time = timeStamp.start;
      newTask.end_time = timeStamp.end;
      addTask(newTask);
      document.getElementById('task-name').value = '';
      document.getElementById('task-amt').value = document.getElementById('hidden-value').value;
      document.getElementsByClassName('task-project-name')[0].style.color = helpers.computeContrast(newTask.color);
      document.getElementById('stopwatch').className = '';
      event.target.className = 'task-control play';
      document.getElementById('hours').innerHTML = document.getElementById('minutes').innerHTML = document.getElementById('seconds').innerHTML = '00';
    }
  }

  // End timer interactions

}());

// Retrieves all tasks related to the given project
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
      taskAmt.value = taskAmt.placeholder = document.getElementById('hidden-value').value; //Set the value and placeholder to the projects default value
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
          var endTime = new Date(res[i].end_time);

          var timestampHours = startTime.getHours();

          if ( timestampHours < 12 ) {
            timestampHours = ( timestampHours === 0 ) ? 12 : timestampHours;
          } else {
            timestampHours = ( timestampHours % 12 );
          }

          ampm = ( startTime.getHours() > 11 ) ? "pm" : "am";
          res[i].start_time = (timestampHours) + ":" + startTime.getMinutes() + ampm; //put into 12-hour time

          timestampHours = endTime.getHours();
          if ( timestampHours < 12 ) {
            timestampHours = ( timestampHours === 0 ) ? 12 : timestampHours;
          } else {
            timestampHours = ( timestampHours % 12 );
          }

          ampm = ( endTime.getHours() > 11 ) ? "pm" : "am";
          res[i].end_time = (timestampHours) + ":" + endTime.getMinutes() + ampm;
          container.innerHTML += Handlebars.templates['task.hbs'](res[i]) + "<br>";
        }

        var tasks = document.getElementsByClassName('task');
        var projectName, projectColor;
        //Set each project labels text color based on the label color itself
        for ( i = 0; i < tasks.length; i++ ) {
          projectName = tasks[i].getElementsByClassName('task-project-name')[0];
          projectColor = helpers.rgbToHex(window.getComputedStyle(projectName).getPropertyValue('background-color'));
          projectName.style.color = helpers.computeContrast(projectColor);
          tasks[i].getElementsByClassName('total-time')[0].innerHTML = calcTotal(tasks[i], 2); //round
        }
      } else {
        container.innerHTML = "There are no tasks";
      }

    }
  };

  req.open('GET', '/tasks/' + params);
  req.send();
}

function addTask(task) {
  task.elapsed = task.elapsed.hours + ":" + task.elapsed.minutes + ":" + task.elapsed.seconds;
  task.color = task.color.replace('#', '');
  task.description = "(No description)";
  task._csrf = document.getElementById('csrf').value;
  delete task.color;

  var req = new XMLHttpRequest();
  req.open('post', '/tasks');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', task._csrf);
  req.send(JSON.stringify(task));
}

function addActive(start) {
  var taskName = ( document.getElementById('task-name').value.length === 0 ) ? "(No description)" : document.getElementById('task-name').value;
  var active = {
    _csrf: document.getElementById('csrf').value,
    task_name: taskName,
    project_name: document.getElementById('timer-project-inner').innerHTML,
    value: document.getElementById('task-amt').innerHTML,
    start_time: start
  };

  var req = new XMLHttpRequest();
  req.open('POST', '/active_tasks');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', active._csrf);
  req.send(JSON.stringify(active));
}

function calcTotal(taskCard, decs) {
  var hours = Number(taskCard.getElementsByClassName('hours')[0].innerHTML);
  var minutes = Number(taskCard.getElementsByClassName('minutes')[0].innerHTML);
  var valueTxt = taskCard.getElementsByClassName('task-value')[0].innerHTML.replace('per hour', '');
  valueTxt = valueTxt.replace('$', '');
  var valueNum = Number(valueTxt.replace(',', ''));
  //Calculate total billable
  var total =  ( (hours / 60) + minutes / 100 ) * valueNum;
  var totalStr = "";
  if ( total < 10 ) {
    totalStr = '$0' + total.toFixed(decs);
  } else {
    totalStr = '$' + total.toFixed(decs);
  }
  return totalStr;
}
