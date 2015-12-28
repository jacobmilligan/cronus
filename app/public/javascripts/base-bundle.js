(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var menu = require('./modules/menu');
var projects = require('./modules/projects');

},{"./modules/menu":3,"./modules/projects":4}],2:[function(require,module,exports){
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

module.exports = {
	detectTouch: detectTouch,
	tint: tint,
	getTransitionTime: getTransitionTime,
	rgbToHex: rgbToHex
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
			liCount += (sliderChildren[i].className === 'menu-item') ? 1 : 0;
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

		moneyInput.addEventListener('input', handleMoney);
		helpers.detectTouch(projectWindow, displayCreateProject, true);
		helpers.detectTouch(newItems[0], displayCreateProject, true);
		helpers.detectTouch(newItems[1], displayCreateProject, true);
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

					var projectSettingsBtns = document.getElementsByClassName('project-settings');

					for (i = 0; i < projectSettingsBtns.length; i++) {
						helpers.detectTouch(projectSettingsBtns[i], showProjectSettings, true);
					}

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

	function sendProject() {
		var labelColor = window.getComputedStyle(document.getElementsByClassName('selected-color')[0]).getPropertyValue('background-color');

		var projectData = {
			_csrf: document.getElementById('csrf').value,
			project_name: document.getElementById('project-name').value,
			description: document.getElementById('project-description').value,
			default_value: Number( document.getElementById('project-amt').value.replace('$', '') ),
			color: helpers.rgbToHex(labelColor)
		};
		// Do tags logic here

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

function showProjectSettings(event) {

}

},{"../templates":5,"./helpers":2}],5:[function(require,module,exports){
require('./templates/projectcards');
},{"./templates/projectcards":6}],6:[function(require,module,exports){
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['projectcards.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"project-grid\" style=\"border-left-color:#"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + "\">\n	<span class=\"dollar-amt\">"
    + alias4(((helper = (helper = helpers.default_value || (depth0 != null ? depth0.default_value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"default_value","hash":{},"data":data}) : helper)))
    + "</span>\n	<div class=\"dropdown-menu\">\n		<a class=\"project-settings\"></a>\n	</div>\n	<h2>"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "</h2>\n	<p>"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "<p>\n	<a href=\"tasks\"><button style=\"background-color:#"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + "\">Go to tasks</button></a>\n</div>";
},"useData":true});
})();
},{}]},{},[1]);
