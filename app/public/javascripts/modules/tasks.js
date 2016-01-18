'use strict';

var helpers = require('./helpers');
var taskCards = require('./task_cards');
require('../templates');

(function() {
  var url = window.location.href;
  var timer;
  var activeTaskName = "";
  var activeValue = "";

  if ( url.indexOf('tasks') > -1 ) {
    document.getElementById('timer-project-inner').style.color = helpers.computeContrast(document.getElementById('hidden-color').value);
    getTasks();
    getActive();

    var taskControl = document.getElementsByClassName('task-control')[0];
    helpers.detectTouch(taskControl, handleTimer, true);
    document.getElementById('task-name').addEventListener('blur', updateActive);
    document.getElementById('task-amt').addEventListener('blur', updateActive);
  }

  function updateActive() {
    var updatedTaskName = document.getElementById('task-name').value;
    var updatedAmt = document.getElementById('task-amt').value;
    if ( updatedTaskName !== activeTaskName || updatedAmt !== activeValue) {
      var data = {
        _csrf: document.getElementById('csrf').value,
        task_name: updatedTaskName,
        value: updatedAmt
      };

      var req = new XMLHttpRequest();
      req.open('put', '/active_tasks');
      req.setRequestHeader('Content-Type', 'application/json');
      req.setRequestHeader('csrfToken', data._csrf);
      req.send(JSON.stringify(data));
    }
  }

  //Handles all timer interactions
  function handleTimer(event) {

    var seconds = document.getElementById('seconds');
    var minutes = document.getElementById('minutes');
    var hours = document.getElementById('hours');
    var secondsNum, minutesNum, hoursNum = 0;
    if ( document.getElementsByClassName('active-timer').length === 0 ) {
      document.getElementById('stopwatch').className = 'timer-component active-timer';
      document.getElementById('task-control').className = 'task-control stop timer-component';

      //Send new active timer to DB
      addActive(new Date());
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

      var elapsed = {
        hours: document.getElementById('hours').innerHTML,
        minutes: document.getElementById('minutes').innerHTML,
        seconds: document.getElementById('seconds').innerHTML
      };

      var timeStamp = {
        end: new Date()
      };

      var diffHours = Number(timeStamp.end.getHours()) - Number(elapsed.hours);
      var diffMinutes = Number(timeStamp.end.getMinutes()) - Number(elapsed.minutes);
      var diffSeconds = Number(timeStamp.end.getSeconds()) - Number(elapsed.seconds);
      timeStamp.start = new Date(timeStamp.end.getFullYear(), timeStamp.end.getMonth(), timeStamp.end.getDate(), diffHours, diffMinutes, diffSeconds);

      var projectName = document.getElementById('timer-project-inner').innerHTML;
      var startAMPM = ( timeStamp.start.getHours() > 11 ) ? "pm" : "am";
      var endAMPM = ( timeStamp.end.getHours() > 11 ) ? "pm" : "am";

      //Object containing task data to send to template
      var newTask = {
        task_name: document.getElementById('task-name').value,
        project_name: projectName,
        value: document.getElementById('task-amt').value,
        elapsed: elapsed,
        start_time: ( timeStamp.start.getHours() % 12 ) + ":",
        end_time: ( timeStamp.end.getHours() % 12 ) + ":",
        color: window.getComputedStyle(document.getElementById('timer-project')).getPropertyValue('background-color'),
        isNew: true
      };

      var uniqueIDs = document.querySelectorAll('[id^="checkbox"]');

      newTask.unique_id = uniqueIDs[uniqueIDs.length-1].id;
      var uID = newTask.unique_id.substring(newTask.unique_id.indexOf('-') + 1);
      newTask.unique_id = newTask.unique_id.replace(newTask.unique_id.substring(newTask.unique_id.indexOf('-')), "-" + (Number(uID) + 1));
      console.log(newTask.unique_id);
      if ( timeStamp.start.getMinutes() < 10 ) {
        newTask.start_time += '0';
      }

      if ( timeStamp.end.getMinutes() < 10 ) {
        newTask.end_time += '0';
      }

      newTask.start_time += timeStamp.start.getMinutes() + startAMPM;
      newTask.end_time += timeStamp.end.getMinutes() + endAMPM;

      if ( newTask.task_name.length < 1 ) {
        newTask.task_name = "(No description)";
      }

      deleteActive();// Delete active timer from DB

      var currPageProj = document.getElementById('project-name').innerHTML;
      currPageProj = currPageProj.substring(currPageProj.indexOf('\"') + 1, currPageProj.lastIndexOf('\"'));
      if ( newTask.project_name === currPageProj) {
        renderInOrder(newTask, timeStamp.end); //Insert at top
      }
      var latestTask = document.getElementsByClassName('task')[0];

      if ( document.getElementsByClassName('total-time').length > 0 ) {
        document.getElementsByClassName('total-time')[0].innerHTML = calcTotal(latestTask, 2);
      }
      newTask.start_time = timeStamp.start;
      newTask.end_time = timeStamp.end;

      addTask(newTask);
      document.getElementById('task-name').value = '';
      document.getElementById('task-amt').value = document.getElementById('hidden-value').value;
      document.getElementById('timer-project').style.backgroundColor = '#' + document.getElementById('hidden-color').value;
      document.getElementById('timer-project-inner').style.backgroundColor = '#' + document.getElementById('hidden-color').value;

      if ( document.getElementsByClassName('task-project-name').length > 0 ) {
        document.getElementsByClassName('task-project-name')[0].style.color = helpers.computeContrast(newTask.color);
      }

      document.getElementById('stopwatch').className = 'timer-component';
      document.getElementById('task-control').className = 'task-control play timer-component';
      document.getElementById('hours').innerHTML = document.getElementById('minutes').innerHTML = document.getElementById('seconds').innerHTML = '00';
    }
  }

  // End timer interactions
  function getActive() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if ( req.status === 200 && req.readyState === 4 ) {
        var res = JSON.parse(req.responseText);
        var activeTimer = res[0];

        //Set default value before altering to reflect active timers value
        var taskAmt = document.getElementById('task-amt');
        if ( document.getElementsByClassName('active-timer').length === 0 ) {
          taskAmt.value = taskAmt.placeholder = document.getElementById('hidden-value').value; //Set the value and placeholder to the projects default value
        }

        if ( res.length > 0 ) {
          var startTime = new Date(activeTimer.start_time);
          var currTime = new Date();
          var timeToAppend = helpers.getTimeDiff(startTime, currTime);
          handleTimer(); //Start timer
          document.getElementById('task-name').value = activeTimer.task_name;
          document.getElementById('task-amt').value = activeTimer.value;
          document.getElementById('hours').innerHTML = (timeToAppend.hours < 10) ? '0' + timeToAppend.hours : timeToAppend.hours;
          document.getElementById('minutes').innerHTML = (timeToAppend.minutes < 10) ? '0' + timeToAppend.minutes : timeToAppend.minutes;
          document.getElementById('seconds').innerHTML = (timeToAppend.seconds < 10) ? '0' + timeToAppend.seconds : timeToAppend.seconds;
          document.getElementById('timer-project').style.backgroundColor = '#' + activeTimer.color;
          document.getElementById('timer-project-inner').style.backgroundColor = '#' + activeTimer.color;
          document.getElementById('timer-project-inner').style.color = '#' + helpers.computeContrast(activeTimer.color);

          document.getElementById('timer-project-inner').innerHTML = activeTimer.project_name;
          activeTaskName = document.getElementById('task-name').value;
          activeValue = document.getElementById('task-amt').value;
        }
      }
    };
    req.open('GET' , '/active_tasks');
    req.send();
  }

}());

// Retrieves all tasks related to the given project
function getTasks() {
  var req = new XMLHttpRequest();
  var url = window.location.href;
  var params = url.substring(url.lastIndexOf('/') + 1);
  var loader = document.getElementsByClassName('loader')[0];

  req.onreadystatechange = function() {
    if ( req.readyState === 4 && req.status === 200 ) {
      var res = JSON.parse(req.responseText);
      loader.style.display = 'none';

      var taskAmt = document.getElementById('task-amt');
      taskAmt.addEventListener('input', helpers.handleMoney);
      taskAmt.addEventListener('blur', helpers.setDefaultValue);
      taskAmt.addEventListener('focus', function(event) {
        if ( event.target.value === event.target.placeholder ) {
          event.target.value = "";
        }
      });

      if ( res.length > 0 ) {
        var noTasks = document.getElementById('no-items');
        noTasks.remove();
        var ampm = "am";

        for ( var i = 0; i < res.length; i++) {
          var startTime = new Date(res[i].start_time);
          var endTime = new Date(res[i].end_time);

          // Reformat start_time hours, adding leading zeroes and converting to 12 hour time as needed
          var timestampHours = startTime.getHours();
          var timestampMinutes = ( startTime.getMinutes() < 10 ) ? '0' + startTime.getMinutes() : startTime.getMinutes();

          if ( timestampHours < 12 ) {
            timestampHours = ( timestampHours === 0 ) ? 12 : timestampHours; // If hours are 'zero-o'clock', change from zero to 12
          } else {
            timestampHours = ( timestampHours % 12 ); // Put into 12-hours time
          }

          ampm = ( startTime.getHours() > 11 ) ? "pm" : "am";
          res[i].start_time = (timestampHours) + ":" + timestampMinutes + ampm; //put into 12-hour time
          //Do the same with end time
          timestampHours = endTime.getHours();
          timestampMinutes = ( endTime.getMinutes() < 10 ) ? '0' + endTime.getMinutes() : endTime.getMinutes();
          if ( timestampHours < 12 ) {
            timestampHours = ( timestampHours === 0 ) ? 12 : timestampHours;
          } else {
            timestampHours = ( timestampHours % 12 );
          }

          ampm = ( endTime.getHours() > 11 ) ? "pm" : "am";
          res[i].end_time = (timestampHours) + ":" + timestampMinutes + ampm;

          res[i].unique_id = "checkbox-" + i;
          //Render the task in order
          renderInOrder(res[i], endTime);

        }

        //Rendered all tasks so attach editor eventListeners
        taskCards.attachEditors();

        var tasks = document.getElementsByClassName('task');
        var projectName, projectColor;
        //Set each project labels text color based on the label color itself
        for ( i = 0; i < tasks.length; i++ ) {
          projectName = tasks[i].getElementsByClassName('task-project-name')[0];
          projectColor = helpers.rgbToHex(window.getComputedStyle(projectName).getPropertyValue('background-color'));
          projectName.style.color = helpers.computeContrast(projectColor);
          tasks[i].getElementsByClassName('total-time')[0].innerHTML = calcTotal(tasks[i], 2); //round
        }
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
  var taskAmt = document.getElementById('task-amt');
  taskAmt.value = taskAmt.placeholder = document.getElementById('hidden-value').value; //Set the value and placeholder to the projects default value
}

function addActive(start) {
  var taskName = ( document.getElementById('task-name').value.length === 0 ) ? "(No description)" : document.getElementById('task-name').value;
  var active = {
    _csrf: document.getElementById('csrf').value,
    task_name: taskName,
    project_name: document.getElementById('timer-project-inner').innerHTML,
    value: document.getElementById('task-amt').value,
    start_time: start,
    color: document.getElementById('hidden-color').value
  };

  var req = new XMLHttpRequest();
  req.open('POST', '/active_tasks');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', active._csrf);
  req.send(JSON.stringify(active));
}

function deleteActive() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if ( req.readyState === 4 && req.status === 200 ) {

    }
  };

  var data =  {
    _csrf:  document.getElementById('csrf').value
  };

  req.open('DELETE', '/active_tasks');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', data._csrf);
  req.send(JSON.stringify(data));
}

function calcTotal(taskCard, decs) {
  var hours = Number(taskCard.getElementsByClassName('hours')[0].innerHTML);
  var minutes = Number(taskCard.getElementsByClassName('minutes')[0].innerHTML);
  var valueTxt = taskCard.getElementsByClassName('task-value')[0].innerHTML.replace('per hour', '');
  valueTxt = valueTxt.replace('$', '');
  var valueNum = Number(valueTxt.replace(',', ''));
  var minuteRate = valueNum / 60;
  var hoursToMinutes = hours * 60;
  //Calculate total billable
  var total = minuteRate * (minutes + hoursToMinutes); //Calculate total per minute
  var totalStr = "";
  if ( total < 10 ) {
    totalStr = '$0' + total.toFixed(decs);
  } else {
    totalStr = '$' + total.toFixed(decs);
  }
  return totalStr;
}

////////////////////////////////////
/* Create date header for sorting */
////////////////////////////////////
function renderInOrder(currTask, dateToSort) {
  var theDate = new Date(dateToSort);
  var dateConverter = new helpers.dateNameConverter();
  var currDate = dateConverter.dayName(theDate.getDay()) + " " + helpers.getOrdinal(theDate.getDate()) + " ";
  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  currDate += dateConverter.monthName(theDate.getMonth()) + ", " + theDate.getFullYear();

  today.setHours(0,0,0,0);
  theDate.setHours(0,0,0,0);
  if ( theDate.toDateString() === today.toDateString() ) {
    currDate = "Today";
  } else if ( theDate.toDateString() === yesterday.toDateString() ) {
    currDate = "Yesterday";
  }

  if ( !document.getElementById(currDate) ) {
    var newDateCollection = document.createElement('DIV');
    newDateCollection.className = "container";
    newDateCollection.id = currDate;
    newDateCollection.innerHTML += "<h2 class=\"date-heading\">" + currDate + "</h1>";
    newDateCollection.innerHTML += Handlebars.templates['task.hbs'](currTask) + "<br>";
    document.getElementById('task-holder').appendChild(newDateCollection);
  } else if (currTask.isNew) {
    //Insert into top of current date container
    var heading = document.getElementById(currDate).getElementsByClassName('date-heading')[0].outerHTML;
    document.getElementById(currDate).innerHTML = heading + Handlebars.templates['task.hbs'](currTask) + "<br>" + document.getElementById(currDate).innerHTML.replace(heading, '');
  } else {
    document.getElementById(currDate).innerHTML += Handlebars.templates['task.hbs'](currTask) + "<br>";
  }
}
