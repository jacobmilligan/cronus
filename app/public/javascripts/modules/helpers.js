'use strict';

function detectTouch(element, event, add) {
	if (add) {
		if ( 'ontouchstart' in window ) {
			element.addEventListener('touch', event);
		} else {
			element.addEventListener('click', event);
		}
	} else {
		if ( 'ontouchstart' in window ) {
			element.removeEventListener('touch', event);
		} else {
			element.removeEventListener('click', event);
		}
	}
	
}

module.exports = {
	detectTouch: detectTouch
};