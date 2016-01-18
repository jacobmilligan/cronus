'use strict';
var helpers = require('./helpers');

function attachEditors() {
  var editBtns = document.getElementsByClassName('task-edit-inner');
  var taskDeleteBtns = document.getElementsByClassName('batch-action delete');
  for ( var i = 0; i < editBtns.length; i++ ) {
    helpers.detectTouch(editBtns[i], displayEditor, true);
  }
  for ( i = 0; i < taskDeleteBtns.length; i++ ) {
    helpers.detectTouch(taskDeleteBtns[i], deleteTasks, true);
  }
}

function displayEditor(event) {
  var parent = event.target.parentNode.parentNode;
  if (event.target.className === 'btn task-save' ) {
    var editIcon = parent.getElementsByClassName('task-edit-inner')[0];
    event.target.style.display = 'none';
    editIcon.style.display = 'inline';
    parent.getElementsByClassName('task-name')[0].disabled = true;
    updateTask(parent); //Save data
  } else {
    var saveBtn = parent.getElementsByClassName('task-save')[0];
    event.target.style.display = 'none';
    saveBtn.style.display = 'inline';
    parent.getElementsByClassName('task-name')[0].disabled = false;
    helpers.detectTouch(saveBtn, displayEditor, true);
  }
}

function updateTask(task) {
  var data = {
    _csrf: document.getElementById('csrf').value,
    task_name: task.getElementsByClassName('task-name')[0].value,
    project_name: task.getElementsByClassName('task-project-name')[0].innerHTML,
    start_time: task.getElementsByClassName('original-start-time')[0].value,
    original_name: task.getElementsByClassName('original-task-name')[0].value
  };
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if ( req.readyState === 4 && req.status === 200 ) {
      var res = req.responseText;
      console.log(res);
    }
  };

  req.open('PUT', '/tasks');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', data._csrf);
  req.send(JSON.stringify(data));
}

function deleteTasks() {
  var checks = document.getElementsByClassName('hidden-batch');
  var data = {
    _csrf: document.getElementById('csrf').value
  };
  var task;
  var unique_id;
  var idsToDelete = [];
  for (var i = 0; i < checks.length; i++) {
    if ( checks[i].checked ) {
      task = checks[i].parentNode.parentNode;
      unique_id = task.getElementsByClassName('hidden-batch')[0].id;
      idsToDelete.push(task.getElementsByClassName('hidden-batch')[0]);
      data[i] = {
        uID: unique_id,
        task_name: task.getElementsByClassName('task-name')[0].value,
        project_name: task.getElementsByClassName('task-project-name')[0].innerHTML,
        start_time: task.getElementsByClassName('original-start-time')[0].value,
        original_name: task.getElementsByClassName('original-task-name')[0].value
      };
    }
  }

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if ( req.readyState === 4 && req.status === 200 ) {
      var res = req.responseText;
      if ( res ) {
        var parent;
        for (var i = 0; i < idsToDelete.length; i++) {
          parent = idsToDelete[i].parentNode.parentNode;
          console.log(parent);
          parent.parentNode.removeChild(parent);
        }
      }
    }
  };

  req.open('DELETE', '/tasks');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', data._csrf);
  req.send(JSON.stringify(data));
}

module.exports = {
  attachEditors: attachEditors
};
