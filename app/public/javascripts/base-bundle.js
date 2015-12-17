(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var menu = require('./modules/menu');

menu;


},{"./modules/menu":2}],2:[function(require,module,exports){
'use strict';

function detectTouch(element, event) {
	if ( 'ontouchstart' in window ) {
		element.addEventListener('touch', event);
	} else {
		element.addEventListener('click', event);
	}
}

function computeHeight(element) {
	var elStyles = window.getComputedStyle(element, null);
	var elHeight = elStyles.getPropertyValue('height').toString();
	elHeight = elHeight.substring(0, elHeight.indexOf('px'));

	var elMargin = elStyles.getPropertyValue('margin').toString();
	elMargin = elMargin.substring(0, elMargin.indexOf('px'));

	var result = Number(elHeight) + Number(elMargin);
	console.log(result);
	return result;
}

(function() {

	var menus = document.getElementsByClassName('activate-menu');
	var menuColors = [];
	for (var i = 0; i < menus.length; i++) {
		menuColors.push(window.getComputedStyle(menus[i], null).getPropertyValue('color'));
	}

	for ( i = 0; i < menus.length; i++ ) {
		detectTouch(menus[i], slideMenu);
		
	}

	var toggled = false;
	var slideTimer;
	var currHeight = 1;

	function slideMenu(event) {
		clearInterval(slideTimer);

		toggled = !toggled;
		
		var maxHeight = 0;
		var minHeight = 0;
		var time = 0;
		var fps = 5;
		var speed = 1;

		var siblings = event.target.parentNode.parentNode.childNodes;
		var slider;
		var icon = event.target;

		for ( i = 0; i < siblings.length; i++ ) {
			if ( siblings[i].className === 'nav-list') {
				slider = siblings[i];
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

		if ( toggled ) {
			console.log(maxHeight);
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
},{}]},{},[1]);
