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
  } else {
    var saveBtn = parent.getElementsByClassName('task-save')[0];
    event.target.style.display = 'none';
    saveBtn.style.display = 'inline';
    parent.getElementsByClassName('task-name')[0].disabled = false;
    helpers.detectTouch(saveBtn, displayEditor, true);
  }
}

module.exports = {
  attachEditors: attachEditors
};
