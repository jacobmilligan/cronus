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
