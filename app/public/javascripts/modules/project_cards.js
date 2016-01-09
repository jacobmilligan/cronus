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
  }
}

function showSettings(event) {
  var currCard = event.target.parentNode;

  if ( currCard.className === "project-grid" ) {
    var cardAttrs = {
      card: currCard,
      settings: currCard.getElementsByClassName('project-settings')[0],
      save: currCard.getElementsByClassName('save')[0],
      value: currCard.getElementsByClassName('dollar-amt')[0],
      title: currCard.getElementsByClassName('project-card-name')[0],
      description: currCard.getElementsByClassName('project-card-description')[0]
    };
    var hiddenStatus = window.getComputedStyle(cardAttrs.settings).getPropertyValue('visibility');

    if ( hiddenStatus === 'visible' ) {
      cardAttrs.settings.style.visibility = 'hidden';
      window.setTimeout(function() {
        cardAttrs.save.style.visibility = 'visible';
        displayInputs(true, cardAttrs);
      }, 100);
    } else {
      cardAttrs.save.style.visibility = 'hidden';
      window.setTimeout(function() {
        cardAttrs.settings.style.visibility = 'visible';
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
  } else {
    attrs.value.disabled = true;
    attrs.title.disabled = true;
    attrs.description.disabled = true;
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
  console.log(changed.color);
  req.onreadystatechange = function() {
    if ( req.status === 200 && req.readyState === 4 ) {
      console.log(req.responseText);
    }
  };

  req.open('PUT', '/projects');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', changed._csrf);
  req.send(JSON.stringify(changed));
}

module.exports = init;
