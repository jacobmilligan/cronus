'use strict';

var helpers = require('./helpers');

// Project page functions
(function() {

	// Run xhr automatically on dashboard load
	if ( window.location.href.indexOf('dashboard') > -1 ) {
		getProjects();
	}

	if ( document.getElementById('new-project') ) {

		var newItem = document.getElementById('new-project');
		var projectWindow = document.getElementsByClassName('project-overlay')[0];
		var labelBtn = document.getElementsByClassName('select-colors')[0];
		var selectedColor = document.getElementsByClassName('selected-color')[0];
		var defaultColor = window.getComputedStyle( selectedColor ).getPropertyValue('background-color');
		var btnBorderColor = window.getComputedStyle(labelBtn).getPropertyValue('border-color');
		helpers.detectTouch(projectWindow, displayCreateProject, true);
		helpers.detectTouch(newItem, displayCreateProject, true);
		helpers.detectTouch(labelBtn, showLabels, true);
	}

	function getProjects() {
		var projects = document.getElementById('projects');
		var noProjects = document.getElementById('no-projects');

		var projReq = new XMLHttpRequest();

		projReq.onreadystatechange = function() {
			if ( projReq.readyState === 4 && projReq.status === 200 ) {
				var projRes = JSON.parse(projReq.responseText);

				// Display projects if there are any
				if ( projRes.length > 0 ) {
					projects.style.display = 'block';

					for (var i = 0; i < projRes.length; i++) {
						buildProject(projRes[i], projects);
					}

				} else {
					noProjects.style.display = 'block';
				}

			}
		};

		projReq.open('GET', 'projects');
		projReq.send();
	}

	// Build a new project card
	function buildProject(pendingProject, parent) {
		var newItem = document.createElement('div');
		newItem.className = 'project-grid';
		newItem.style.borderLeftColor = '#' + pendingProject.color;

		newItem.addEventListener('mouseover', function() {
			newItem.style.backgroundColor = helpers.tint(pendingProject.color, 95);
		});
		newItem.addEventListener('mouseout', function() {
			newItem.style.backgroundColor = '#f7f7f7';
		});

		pendingProject.default_value = pendingProject.default_value.replace('$', '');

		var htmlString = "<span class=\"dollar-amt\">" + pendingProject.default_value + "</span>";
		htmlString += "<a class=\"project-settings\"></a>";
		htmlString += "<h2>" + pendingProject.project_name + "</h2>\n";
		htmlString += "<p>" + pendingProject.description + "</p>\n";

		// Uncomment when db joins tags onto query
		/*
		if ( pendingProject.tags.length > 0 ) {
			htmlString += "<ul class=\"project-tag-list\">";
			for ( var j = 0; j < pendingProject.tags.length; j++ ) {
				htmlString += "<li>" + pendingProject.tags[j] + "</li>";
			}
			htmlString += "</ul>";
		}
		*/

		newItem.innerHTML = htmlString;
		parent.appendChild(newItem);
	}

	// Displays the window for adding a new project
	function displayCreateProject(event) {
		if ( document.getElementById('toggled-new-project') ) {
			
			if ( event.target.id === 'toggled-new-project' ) {

				var fadeInterval = helpers.getTransitionTime(projectWindow);
				var labelContainer = document.getElementsByClassName('color-list')[0];

				var inputs = [document.getElementById('project-name'), document.getElementById('project-description')];

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

}());