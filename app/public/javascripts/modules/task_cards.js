'use strict';
var helpers = require('./helpers');

function attachEditors() {
  var editBtns = document.getElementsByClassName('task-edit-inner');
  for (var i = 0; i < editBtns.length; i++) {
    helpers.detectTouch(editBtns[i], displayEditor, true);
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
    task_name: task.getElementsByClassName('task-name')[0].value
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

module.exports = {
  attachEditors: attachEditors
};
