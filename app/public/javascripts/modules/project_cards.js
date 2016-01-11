'use strict';

var helpers = require('./helpers');

function init() {
  var settingsButtons = document.getElementsByClassName('project-settings');
  var saveButtons = document.getElementsByClassName('save');
  if ( settingsButtons.length > 0 ) {
    for (var i = 0; i < settingsButtons.length; i++) {
      helpers.detectTouch(settingsButtons[i], showSettings, true);
      helpers.detectTouch(saveButtons[i], showSettings, true);
    }
    helpers.detectTouch(document.getElementsByClassName('heading')[0], hideEditable, true);
    helpers.detectTouch(document.getElementById('projects'), hideEditable, true);
    helpers.detectTouch(document.getElementById('main-nav'), hideEditable, true);
  }
}

function showSettings(event) {
  var currCard = event.target.parentNode;

  if ( currCard.className === "project-grid" ) {
    var cardAttrs = {
      card: currCard,
      settings: currCard.getElementsByClassName('project-settings')[0],
      save: currCard.getElementsByClassName('save')[0],
      deleteBtn: currCard.getElementsByClassName('delete-container')[0],
      gotoTasks: currCard.getElementsByClassName('goto-tasks')[0],
      value: currCard.getElementsByClassName('dollar-amt')[0],
      title: currCard.getElementsByClassName('project-card-name')[0],
      description: currCard.getElementsByClassName('project-card-description')[0]
    };
    var hiddenStatus = window.getComputedStyle(cardAttrs.save).getPropertyValue('visibility');

    if ( hiddenStatus === 'hidden' ) {
      //Show active cards input fields
      cardAttrs.settings.style.visibility = 'hidden';
      cardAttrs.gotoTasks.style.visibility = 'hidden';
      window.setTimeout(function() {
        cardAttrs.save.style.visibility = 'visible';
        cardAttrs.deleteBtn.style.visibility = 'visible';
        displayInputs(true, cardAttrs);
      }, 100);
    } else {
      //Hide active cards input fields
      cardAttrs.save.style.visibility = 'hidden';
      cardAttrs.deleteBtn.style.visibility = 'hidden';
      window.setTimeout(function() {
        cardAttrs.settings.style.visibility = 'visible';
        cardAttrs.gotoTasks.style.visibility = 'visible';
        displayInputs(false, cardAttrs);
        saveChanges(cardAttrs);
      }, 100);
    }
  }
}

function displayInputs(display, attrs) {

  if (display) {
    attrs.value.disabled = false;
    attrs.title.disabled = false;
    attrs.description.disabled = false;
    attrs.value.addEventListener('input', helpers.handleMoney);
    attrs.card.id = 'editable-card';
    helpers.detectTouch(attrs.deleteBtn, deleteProject, true);
  } else {
    attrs.value.disabled = true;
    attrs.title.disabled = true;
    attrs.description.disabled = true;
    attrs.card.removeAttribute('ID');
    helpers.detectTouch(attrs.deleteBtn, deleteProject, false);
  }

}

function hideEditable(event) {
  var editableParent = [event.target, event.target.parentNode, event.target.parentNode.parentNode, event.target.parentNode.parentNode.parentNode];
  var isEditable = false;

  for (var i = 0; i < editableParent.length; i++) {
    if ( editableParent[i].id === 'editable-card' ) {
      isEditable = true;
    }
  }

  if ( !isEditable && document.getElementById('editable-card') ) {
    var visibleElements = document.getElementById('editable-card').querySelectorAll('.dollar-amt, .project-card-name, .project-card-description, .delete-container, .save');
    //Hide inputs & buttons
    for ( i = 0; i < visibleElements.length; i++ ) {
      if ( visibleElements[i].className === 'btn save' || visibleElements[i].className === 'delete-container' ) {
        visibleElements[i].style.visibility = 'hidden';
      } else {
        visibleElements[i].disabled = true;
      }
    }
    document.getElementById('editable-card').getElementsByClassName('project-settings')[0].style.visibility = 'visible';
    document.getElementById('editable-card').getElementsByClassName('goto-tasks')[0].style.visibility = 'visible';
  }
}

function saveChanges(original, title) {
  var changed = {
    _csrf: document.getElementById('csrf').value,
    value: original.card.getElementsByClassName('dollar-amt')[0].value,
    title: original.card.getElementsByClassName('project-card-name')[0].value,
    description: original.card.getElementsByClassName('project-card-description')[0].value,
    original: original.card.getElementsByClassName('original-title')[0].value,
    color: helpers.rgbToHex(window.getComputedStyle(original.card).getPropertyValue('border-left-color'))
  };
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if ( req.status === 200 && req.readyState === 4 ) {
      if ( req.responseText ) {
        var tooltip = original.card.getElementsByClassName('manual-tooltip')[0];
        tooltip.getElementsByTagName('p')[0].innerHTML = "A project with the name " + changed.title + " already exists.";
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        original.title.value = original.card.getElementsByClassName('original-title')[0].value;
        window.setTimeout(function() {
          original.card.getElementsByClassName('manual-tooltip')[0].style.visibility = 'hidden';
          original.card.getElementsByClassName('manual-tooltip')[0].style.opacity = '0';
        }, 2000);
      }
    }
  };

  req.open('PUT', '/projects');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', changed._csrf);
  req.send(JSON.stringify(changed));
}

function deleteProject(event) {
  var deleteContainer = event.target.parentNode;
  var confirmContainer = deleteContainer.getElementsByClassName('confirm')[0];

  if ( event.target.className === 'btn delete' && deleteContainer.getElementsByClassName('confirm')[0].style.display !== 'inline-block' ) {
    deleteContainer.getElementsByClassName('btn delete')[0].style.display = 'none';
    confirmContainer.style.display = 'inline-block';
  }

  if ( event.target.id === 'project-delete-cancel' ) {
    deleteContainer = event.target.parentNode.parentNode;
    event.target.parentNode.style.display = 'none';
    deleteContainer.getElementsByClassName('btn delete')[0].style.display = 'inline';
  }

  if ( event.target.id === 'project-delete-confirm' ) {
    var data = {
      project_name: document.getElementById('editable-card').getElementsByClassName('original-title')[0].value,
      _csrf: document.getElementById('csrf').value
    };
    sendDelete(data);
  }

}

function sendDelete(data) {
  var req = new XMLHttpRequest();

  req.open('DELETE', '/projects');

  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', data._csrf);
  req.send(JSON.stringify(data));
  var elToRemove = document.getElementById('editable-card');
  elToRemove.parentNode.removeChild(elToRemove);
}
module.exports = init;
