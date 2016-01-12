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

	function showLabels(event) {

		var labelContainer = document.getElementsByClassName('color-list')[0];
		var labelColors = document.getElementsByClassName('color-item');

		for (var i = 0; i < labelColors.length; i++) {
			helpers.detectTouch(labelColors[i], attachColor, true);
		}

		if ( document.getElementById('labels-toggled') && event.target.className !== 'dropdown-color' && event.target.className !== 'color-list' && event.target.className !== 'color-item' ) {
			labelBtn.removeAttribute('id');
			selectedColor.removeAttribute('id');
			labelContainer.style.opacity = 0;
			labelBtn.style.borderColor = btnBorderColor.toString();

			var fadeInterval = helpers.getTransitionTime(labelContainer);
			helpers.detectTouch(document.body, showLabels, false);

			setTimeout(function() {
				labelContainer.style.display = 'none';
			}, fadeInterval);

		} else {
			labelBtn.id = 'labels-toggled';
			selectedColor.id = 'labels-toggled';
			labelContainer.style.display = 'block';
			labelContainer.style.opacity = 1;
			labelBtn.style.borderColor = '#346ca5';
			window.setTimeout(function() {
				helpers.detectTouch(document.body, showLabels, true);
			}, 100);
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
			description: document.getElementById('project-description').value,
			default_value: Number( document.getElementById('project-amt').value.replace('$', '') ),
			color: helpers.rgbToHex(labelColor)
		};

		projectData.project_name = (document.getElementById('project-name').value.length === 0) ? "(No description)" : document.getElementById('project-name').value;
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
