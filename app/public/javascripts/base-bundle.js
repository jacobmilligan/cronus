(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/menu');
require('./modules/projects');
require('./modules/tasks');
require('./modules/project_cards');

},{"./modules/menu":3,"./modules/project_cards":4,"./modules/projects":5,"./modules/tasks":6}],2:[function(require,module,exports){
'use strict';

function detectTouch(element, event, add) {
	if (add) {
		if ( 'ontouchstart' in window ) {
			element.addEventListener('touchstart', event);
		} else {
			element.addEventListener('click', event);
		}
	} else {
		if ( 'ontouchstart' in window ) {
			element.removeEventListener('touchstart', event);
		} else {
			element.removeEventListener('click', event);
		}
	}
}

function getTransitionTime(element) {
	var opacityLength = window.getComputedStyle(element, null).getPropertyValue('transition');
	opacityLength = opacityLength.substring(opacityLength.indexOf('0'), opacityLength.indexOf('s'));
	return ( Number(opacityLength) * 1000 );
}

function mixColor(base, color, weight) {
  function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
  function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal

  var percentChange = (typeof(weight) !== 'undefined') ? weight : 50; // set the percent to 50%, if that argument is omitted

  var result = "#";

  for(var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs— red, green, and blue
    var v1 = h2d(base.substr(i, 2)), // extract the current pairs
        v2 = h2d(color.substr(i, 2)),

        // combine the current pairs from each source color, according to the specified percent
        val = d2h(Math.floor(v2 + (v1 - v2) * (percentChange / 100.0)));

    while(val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit

    result += val; // concatenate val to our new result string
  }

  return result; // PROFIT!
}

function tint(color, percent) {
	color = color.replace('#', '');
	return mixColor('ffffff', color, percent);
}

function rgbToHex(rgb) {
	rgb = rgb.replace('rgb(', '');
	rgb = rgb.replace(')', '');
	rgb = rgb.split(',');
	var vals = {
		r: parseInt(rgb[0]),
		g: parseInt(rgb[1]),
		b: parseInt(rgb[2])
	};
	var result = vals.r.toString(16) + vals.g.toString(16) + vals.b.toString(16);
	return result.toUpperCase();
}

function handleMoney(event) {
	var strToAppend = event.target.value.replace('$', '');
	event.target.value = "";

	if ( isNaN(strToAppend) ) {
		strToAppend = strToAppend.substring(0, strToAppend.length - 1);
	}

	if ( strToAppend.length > 0 ) {
		event.target.value = "$" + strToAppend;
	}
}

//Uses the text boxes placeholder to set a default value
//Also fixes the zeroes and dots placement to look uniform
function setDefaultValue(event) {
	var defVal = event.target.placeholder;
	if ( event.target.value.length === 0 ) {
		event.target.value = defVal;
	} else {
		var dotPlace = event.target.value.indexOf('.');
		if ( dotPlace < 0  || dotPlace === event.target.value.length - 1 ) {
			event.target.value = event.target.value.replace('.', '');
			event.target.value += '.00';
		}
		if ( event.target.value.substring(dotPlace).length === 2 ) {
			event.target.value += '0';
		}
	}
}

function computeContrast(color) {
	var result = ( color > 0xffffff/2) ? '#272727' : '#F8F8F8'; //Sets text color based off contrast with label color
	return result;
}

function getTimeDiff(start, current) {
	var msDiff = (current - start);
	var minutesDiff = ( ( (msDiff / 60) / 60 ) / 1000) * 60;
	var hoursDiff = Math.floor(minutesDiff / 60);
	var secsDiff = Math.floor( ( minutesDiff * 60 ) - (Math.floor(minutesDiff) * 60) );
	minutesDiff = ( minutesDiff % 60 );
	minutesDiff = ( minutesDiff > 59 ) ? minutesDiff - 60 : minutesDiff;
	minutesDiff = Math.floor(minutesDiff);
	return {
		seconds: secsDiff,
		minutes: minutesDiff,
		hours: hoursDiff
	};
}

module.exports = {
	detectTouch: detectTouch,
	tint: tint,
	getTransitionTime: getTransitionTime,
	rgbToHex: rgbToHex,
	handleMoney: handleMoney,
	setDefaultValue: setDefaultValue,
	computeContrast: computeContrast,
	getTimeDiff: getTimeDiff
};

},{}],3:[function(require,module,exports){
'use strict';

var helpers = require('./helpers');

function computeHeight(element) {
	var elStyles = window.getComputedStyle(element, null);
	var elHeight = elStyles.getPropertyValue('height').toString();
	elHeight = elHeight.substring(0, elHeight.indexOf('px'));

	var elMargin = elStyles.getPropertyValue('margin').toString();
	elMargin = elMargin.substring(0, elMargin.indexOf('px'));

	var result = Number(elHeight) + Number(elMargin);
	return result;
}

(function() {

	var menus = document.getElementsByClassName('activate-menu');
	var content = document.getElementsByClassName('content')[0];
	var menuColors = [];

	for (var i = 0; i < menus.length; i++) {
		menuColors.push(window.getComputedStyle(menus[i], null).getPropertyValue('color'));
	}

	for ( i = 0; i < menus.length; i++ ) {
		helpers.detectTouch(menus[i], slideMenu, true);
	}

	var slideTimer;
	var currHeight = 1;

	function slideMenu(event) {
		clearInterval(slideTimer);

		var maxHeight = 0;
		var minHeight = 0;
		var time = 0;
		var fps = 5;
		var speed = 1;

		var siblings = event.target.parentNode.parentNode.childNodes;
		var slider;
		if ( event.target.parentNode.className === 'activate-menu' || event.target.className === 'activate-menu' ) {
			for ( i = 0; i < siblings.length; i++ ) {
				if ( siblings[i].className === 'nav-list') {
					slider = siblings[i];
				}
			}
		} else {
			slider = document.getElementById('active-menu');
		}

		var toggled = ( !slider.id ) ? true : false;
		slider.id = ( toggled ) ? 'active-menu' : '';

		var navChildren = slider.parentNode.childNodes;
		var icon;

		for ( i = 0; i < navChildren.length; i++) {
			if ( navChildren[i].className === 'activate-menu' ) {
				if ( navChildren[i].childNodes.length > 0 ) {
					icon = navChildren[i].childNodes[0];
				} else {
					icon = navChildren[i];
				}
			}
		}

		if (toggled) {
			slider.style.display = 'block';
			icon.style.color = "#CC4C37";
		} else {
			icon.style.color = "#F8F8F8";
		}

		var sliderChildren = slider.childNodes;
		var liCount = 0;

		for ( i = 0; i < sliderChildren.length; i++ ) {
			liCount += (sliderChildren[i].className === 'menu-item' || sliderChildren[i].className === 'menu-item desktop-hide' ) ? 1 : 0;
		}

		maxHeight = computeHeight(sliderChildren[1]) * liCount;
		var targ;

		if ( event.target.className === 'activate-menu' ) {
			targ = 'activate-menu';
		} else if ( event.target.parentNode.className === 'activate-menu' ) {
			targ = 'activate-menu';
		}

		if ( toggled && targ === 'activate-menu' ) {
			helpers.detectTouch(content, slideMenu, true);
			slideTimer = setInterval(function() {
				if ( currHeight > maxHeight - 15 ) {
					currHeight += 0.5;
					slider.style.height = currHeight + 'px';

					if ( currHeight > maxHeight ) {
						clearInterval(slideTimer);
					}

				} else {
					time += 0.1;
					currHeight += (time * fps);
					slider.style.height = currHeight + 'px';
				}
			}, speed);
		} else {
			helpers.detectTouch(content, slideMenu, false);
			slideTimer = setInterval(function() {
				if ( currHeight <= minHeight ) {
					slider.style.height = 0 + 'px';
					clearInterval(slideTimer);
					slider.style.display = 'none';
				} else {
					time += fps;
					currHeight /= 1.15;
					currHeight -= 0.01;
					slider.style.height = currHeight + 'px';
				}
			}, speed);
		}
	}
}());

},{"./helpers":2}],4:[function(require,module,exports){
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

},{"./helpers":2}],5:[function(require,module,exports){
'use strict';

var helpers = require('./helpers');
var projectCards = require('./project_cards');
require('../templates');

// Project page functions
(function() {

	// Run xhr automatically on dashboard load
	if ( window.location.href.indexOf('projects') > -1 ) {
		getProjects();

		var newItems = document.getElementsByClassName('new-project');
		var projectWindow = document.getElementsByClassName('project-overlay')[0];
		var labelBtn = document.getElementsByClassName('select-colors')[0];
		var selectedColor = document.getElementsByClassName('selected-color')[0];
		var defaultColor = window.getComputedStyle( selectedColor ).getPropertyValue('background-color');
		var btnBorderColor = window.getComputedStyle(labelBtn).getPropertyValue('border-color');
		var moneyInput = document.getElementById('project-amt');
		var addProjectBtn = document.getElementById('add-project');

		moneyInput.addEventListener('input', helpers.handleMoney);
		helpers.detectTouch(projectWindow, displayCreateProject, true);
		helpers.detectTouch(newItems[0], displayCreateProject, true);
		helpers.detectTouch(labelBtn, showLabels, true);
		helpers.detectTouch(addProjectBtn, sendProject, true);
	}

	function getProjects() {
		var projects = document.getElementById('projects');
		var noProjects = document.getElementById('no-projects');

		var projReq = new XMLHttpRequest();

		projReq.onreadystatechange = function() {
			if ( projReq.readyState === 4 && projReq.status === 200 ) {
				var projRes = JSON.parse(projReq.responseText);

				var loader = document.getElementsByClassName('loader')[0];
				loader.style.display = 'none';
				// Display projects if there are any
				if ( projRes.length > 0 ) {
					projects.style.display = 'block';
					noProjects.style.display = 'none';
					var container = document.getElementsByClassName('projects-container')[0];

					for (var i = 0; i < projRes.length; i++) {
						//buildProject(projRes[i], projects);
						projRes[i].default_value = projRes[i].default_value.replace('$', '');
						container.innerHTML += Handlebars.templates['projectcards.hbs'](projRes[i]);
					}

					for (i = 0; i < container.childNodes.length; i++) {
						colorProject(container.childNodes[i]);
					}

					//Handle events dependant on rendered cards
					projectCards();

				} else {
					noProjects.style.display = 'block';
				}

			}
		};
		projReq.open('GET', '/projects');
		projReq.send();
	}

	// Build a new project card
	function colorProject(newItem) {
		newItem.addEventListener('mouseover', function() {
			newItem.style.backgroundColor = helpers.tint( helpers.rgbToHex(newItem.style.borderLeftColor), 95 );
		});
		newItem.addEventListener('mouseout', function() {
			newItem.style.backgroundColor = '#f7f7f7';
		});
	}

	// Displays the window for adding a new project
	function displayCreateProject(event) {
		if ( document.getElementById('toggled-new-project') ) {

			if ( event.target.id === 'toggled-new-project' ) {
				var fadeInterval = helpers.getTransitionTime(projectWindow);
				var labelContainer = document.getElementsByClassName('color-list')[0];

				var inputs = document.getElementsByClassName('form-input');

				labelContainer.style.opacity = 0;
				labelContainer.style.display = 'none';
				labelBtn.style.borderColor = btnBorderColor.toString();
				labelBtn.removeAttribute('id');

				projectWindow.style.opacity = 0;
				projectWindow.removeAttribute('id');

				setTimeout(function() {
					selectedColor.style.backgroundColor = defaultColor;
					projectWindow.style.visibility = 'hidden';
					for (var i = 0; i < inputs.length; i++) {
						inputs[i].value = "";
					}
				}, fadeInterval);
			}

		} else {
			projectWindow.style.visibility = 'visible';
			projectWindow.style.opacity = 1;
			projectWindow.id = 'toggled-new-project';
		}
	}

	function showLabels() {
		/*jshint validthis: true */

		var labelContainer = document.getElementsByClassName('color-list')[0];
		var labelColors = document.getElementsByClassName('color-item');

		for (var i = 0; i < labelColors.length; i++) {
			helpers.detectTouch(labelColors[i], attachColor, true);
		}

		if ( this.id === 'labels-toggled' ) {
			labelBtn.removeAttribute('id');
			labelContainer.style.opacity = 0;
			labelBtn.style.borderColor = btnBorderColor.toString();

			var fadeInterval = helpers.getTransitionTime(labelContainer);

			setTimeout(function() {
				labelContainer.style.display = 'none';
			}, fadeInterval);

		} else {
			this.id = 'labels-toggled';
			labelContainer.style.display = 'block';
			labelContainer.style.opacity = 1;
			labelBtn.style.borderColor = '#346ca5';
		}

	}

	function attachColor() {
		/*jshint validthis: true */
		var pendingColor = window.getComputedStyle(this).getPropertyValue('background-color');
		selectedColor.style.backgroundColor = pendingColor;
		var labelContainer = document.getElementsByClassName('color-list')[0];
		labelBtn.removeAttribute('id');
		labelContainer.style.opacity = 0;

		var fadeInterval = helpers.getTransitionTime(labelContainer);

			setTimeout(function() {
				labelContainer.style.display = 'none';
			}, fadeInterval);

		labelBtn.style.borderColor = btnBorderColor.toString();
	}

	function sendProject() {
		var labelColor = window.getComputedStyle(document.getElementsByClassName('selected-color')[0]).getPropertyValue('background-color');

		var projectData = {
			_csrf: document.getElementById('csrf').value,
			project_name: document.getElementById('project-name').value,
			description: document.getElementById('project-description').value,
			default_value: Number( document.getElementById('project-amt').value.replace('$', '') ),
			color: helpers.rgbToHex(labelColor)
		};
		//TODO: Do tags logic here

		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/projects");
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('csrfToken', projectData._csrf);
		xhr.onreadystatechange = function() {
			if ( xhr.readyState === 4 && xhr.status === 200 ) {
				var projectCards = document.getElementsByClassName('project-grid');
				for (var i = 0; i < projectCards.length; i++) {
					projectCards[i].parentNode.removeChild(projectCards[i]);
				}
				projectCards[0].parentNode.removeChild(projectCards[0]);
			}
		};
		xhr.send( JSON.stringify(projectData) );

		var fadeInterval = helpers.getTransitionTime(projectWindow);
		var labelContainer = document.getElementsByClassName('color-list')[0];

		var inputs = document.getElementsByClassName('form-input');

		labelContainer.style.opacity = 0;
		labelContainer.style.display = 'none';
		labelBtn.style.borderColor = btnBorderColor.toString();
		labelBtn.removeAttribute('id');

		setTimeout(function() {
			selectedColor.style.backgroundColor = defaultColor;
			projectWindow.style.opacity = 0;
			projectWindow.removeAttribute('id');
			projectWindow.style.visibility = 'hidden';
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].value = "";
			}
			getProjects();
		}, fadeInterval);
	}

}());

},{"../templates":7,"./helpers":2,"./project_cards":4}],6:[function(require,module,exports){
'use strict';

var helpers = require('./helpers');
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
    var container = document.getElementsByClassName('container')[0];
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
        color: window.getComputedStyle(document.getElementById('timer-project')).getPropertyValue('background-color')
      };

      if ( timeStamp.start.getMinutes() < 10 ) {
        newTask.start_time += '0';
      }

      if ( timeStamp.end.getMinutes() < 10 ) {
        newTask.end_time += '0';
      }

      newTask.start_time += timeStamp.start.getMinutes() + startAMPM;
      newTask.end_time += timeStamp.end.getMinutes() + endAMPM;

      if ( newTask.task_name === "" ) {
        newTask.task_name = "(No description)";
      }

      deleteActive();
      var currPageProj = document.getElementById('project-name').innerHTML;
      currPageProj = currPageProj.substring(currPageProj.indexOf('\"') + 1, currPageProj.lastIndexOf('\"'));
      if ( newTask.project_name === currPageProj) {
        container.innerHTML = Handlebars.templates['task.hbs'](newTask) + "<br>" + container.innerHTML;
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
  var container = document.getElementsByClassName('container')[0];

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
        var ampm = "am";
        for (var i = 0; i < res.length; i++) {
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

},{"../templates":7,"./helpers":2}],7:[function(require,module,exports){
require('./templates/projectcards');
require('./templates/task');

},{"./templates/projectcards":8,"./templates/task":9}],8:[function(require,module,exports){
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['projectcards.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"project-grid\" style=\"border-left-color:#"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + "\">\n	<input type=\"hidden\" value=\""
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "\" class=\"original-title\">\n	<input type=\"text\" class=\"dollar-amt\" value=\"$"
    + alias4(((helper = (helper = helpers.default_value || (depth0 != null ? depth0.default_value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"default_value","hash":{},"data":data}) : helper)))
    + "\" disabled>\n	<a class=\"project-settings\"></a>\n	<button class=\"btn save\">Save</button>\n	<div class=\"tooltip-element\">\n		<div class=\"manual-tooltip\">\n			<p></p>\n		</div>\n		<input type=\"text\" class=\"project-card-name\" value=\""
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "\" disabled>\n	</div>\n\n	<textarea type=\"text\" class=\"project-card-description\" disabled>"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</textarea>\n	<span class=\"goto-tasks\">\n		<a href=\"tasks/"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "\"><button style=\"background-color:#"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + "\">Go to tasks</button></a>\n	</span>\n	<div class=\"delete-container\">\n		<button class=\"btn delete\">Delete Project</button>\n		<span class=\"confirm\">\n			Are you sure?\n			<button id=\"project-delete-cancel\" class=\"btn\">No</button>\n			<button id=\"project-delete-confirm\" class=\"btn\">Yes</button>\n		</span>\n	</div>\n</div>\n";
},"useData":true});
})();
},{}],9:[function(require,module,exports){
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['task.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<div class=\"task\">\n  <div class=\"task-section task-info\">\n    <span class=\"task-name inline\">"
    + alias4(((helper = (helper = helpers.task_name || (depth0 != null ? depth0.task_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"task_name","hash":{},"data":data}) : helper)))
    + "</span> <span class=\"task-project-name inline\" style=\"background-color:"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + ";\">"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "</span>\n    <span class=\"task-value\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + " per hour</span>\n  </div>\n  <div class=\"task-section task-tags\"></div>\n  <div class=\"task-section task-elapsed\">\n    <div class=\"task-subsection inline\">\n      <span class=\"hours\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.elapsed : depth0)) != null ? stack1.hours : stack1), depth0))
    + "</span>:<span class=\"minutes\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.elapsed : depth0)) != null ? stack1.minutes : stack1), depth0))
    + "</span>:<span class=\"seconds\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.elapsed : depth0)) != null ? stack1.seconds : stack1), depth0))
    + "</span>\n    </div>\n    <div class=\"task-subsection inline\">\n      <span class=\"task-start\">"
    + alias4(((helper = (helper = helpers.start_time || (depth0 != null ? depth0.start_time : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"start_time","hash":{},"data":data}) : helper)))
    + "</span> - <span class=\"task-end\">"
    + alias4(((helper = (helper = helpers.end_time || (depth0 != null ? depth0.end_time : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"end_time","hash":{},"data":data}) : helper)))
    + "</span>\n    </div>\n    <div class=\"task-subsection inline\">\n      <span class=\"total-time\">$00.00</span>\n    </div>\n  </div>\n</div>\n";
},"useData":true});
})();
},{}]},{},[1]);
