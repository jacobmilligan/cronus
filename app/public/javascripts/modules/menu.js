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
