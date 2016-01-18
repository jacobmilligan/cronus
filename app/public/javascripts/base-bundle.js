(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/menu');
require('./modules/projects');
require('./modules/tasks');
require('./modules/project_cards');
require('./modules/task_cards');

},{"./modules/menu":4,"./modules/project_cards":6,"./modules/projects":7,"./modules/task_cards":8,"./modules/tasks":9}],2:[function(require,module,exports){
'use strict';
var helpers = require('./helpers');

var self = this;

function Dropdown() {
  this.collection = document.getElementsByClassName('dropdown-icon');
  self.active_menu = undefined;
}

Dropdown.prototype.init = function() {
  helpers.detectTouch(document.body, this.display, true);
};

Dropdown.prototype.display = function(event) {
  var targClass = event.target.className;
  //Check if event is a dropdown entity
  if ( targClass.indexOf('dropdown-icon') >= 0 || targClass.indexOf('dropdown-menu') >= 0 || targClass.indexOf('dropdown-action') >= 0 ) {

    var parent = event.target.parentNode;
    if ( parent.className.indexOf('dropdown-menu') >= 0 ) {
      //Climb the DOM up one node
      parent = parent.parentNode;
    }

    var menu = parent.getElementsByClassName('dropdown-menu')[0];
    if ( self.active_menu !== undefined ) {

      if ( self.active_menu === menu ) {
        //Hide clicked menu
        self.active_menu.style.visibility = 'hidden';
        self.active_menu = undefined;
      } else {
        //Hide whatever the currently active menu on the page is
        self.active_menu.style.visibility = 'hidden';
        self.active_menu = menu;
        menu.style.visibility = 'visible'; //Display clicked menu
      }
    } else {
      //Show clicked menu
      menu.style.visibility = 'visible';
      self.active_menu = menu;
    }

    //Hide active menu if a non-dropdown entity was clicked
  } else if ( self.active_menu !== undefined ) {
    self.active_menu.style.visibility = 'hidden';
    self.active_menu = undefined;
  }

};

module.exports = Dropdown;

},{"./helpers":3}],3:[function(require,module,exports){
'use strict';

//Resets :hover state of all 'display-only' buttons used as decorative elements
(function() {
	var displayOnly = document.getElementsByClassName('btn-display-only');
	if ( displayOnly.length > 0 ) {
		var currColor;
		for (var i = 0; i < displayOnly.length; i++) {
			displayOnly[i].addEventListener('mouseover', resetBackColor);
			displayOnly[i].addEventListener('touchstart', resetBackColor); //for mobiles
		}
	}

	function resetBackColor(event) {
		console.log(event);
		currColor = window.getComputedStyle(event.target).getPropertyValue('background-color');
		event.target.style.backgroundColor = currColor;
		if ( event.type === 'touchstart' ) {
			event.target.removeEventListener('touchstart', resetBackColor);
		}
		if ( event.type === 'mouseover' ) {
			event.target.removeEventListener('mouseover', resetBackColor);
		}
	}
}());

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

function dateNameConverter() {
	/*jshint validthis: true */
	var dayNames = {
		0: "Sunday",
		1: "Monday",
		2: "Tuesday",
		3: "Wednesday",
		4: "Thursday",
		5: "Friday",
		6: "Saturday"
	};

	var monthNames = {
		0: "January",
		1: "February",
		2: "March",
		3: "April",
		4: "May",
		5: "June",
		6: "July",
		7: "August",
		8: "September",
		9: "October",
		10: "November",
		11: "December"
	};

	this.dayName = function(day) {
		return dayNames[day];
	};

	this.monthName = function(month) {
		return monthNames[month];
	};
}

function getOrdinal(num) {
	var check = num % 100;
	var numStr = String(check);
	switch (numStr.substring(numStr.length - 1)) {
		case '1':
			numStr = 'st';
			break;
		case '2':
			numStr = 'nd';
			break;
		case '3':
			numStr = 'rd';
			break;
		default: numStr = 'th';
	}

	if ( num === 0 ) {
		numStr = "";
	}

	if ( check > 9 && check < 20 ) {
		numStr = 'th';
	}

	return num + "<span class=\"ordinal\">" + numStr + "</span>";
}

module.exports = {
	detectTouch: detectTouch,
	tint: tint,
	getTransitionTime: getTransitionTime,
	rgbToHex: rgbToHex,
	handleMoney: handleMoney,
	setDefaultValue: setDefaultValue,
	computeContrast: computeContrast,
	getTimeDiff: getTimeDiff,
	dateNameConverter: dateNameConverter,
	getOrdinal: getOrdinal
};

},{}],4:[function(require,module,exports){
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

},{"./helpers":3}],5:[function(require,module,exports){

/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.

  If you want to use this as a substitute for Math.random(), use the random()
  method like so:

  var m = new MersenneTwister();
  var randomNumber = m.random();

  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/

/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

var MersenneTwister = function(seed) {
  if (seed == undefined) {
    seed = new Date().getTime();
  }
  /* Period parameters */
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df;   /* constant vector a */
  this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
  this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

  this.mt = new Array(this.N); /* the array for the state vector */
  this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

  this.init_genrand(seed);
}

/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
  this.mt[0] = s >>> 0;
  for (this.mti=1; this.mti<this.N; this.mti++) {
      var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
   this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
  + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
  }
}

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
  var i, j, k;
  this.init_genrand(19650218);
  i=1; j=0;
  k = (this.N>key_length ? this.N : key_length);
  for (; k; k--) {
    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
      + init_key[j] + j; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++; j++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
    if (j>=key_length) j=0;
  }
  for (k=this.N-1; k; k--) {
    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
      - i; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
  }

  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
}

/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
  var y;
  var mag01 = new Array(0x0, this.MATRIX_A);
  /* mag01[x] = x * MATRIX_A  for x=0,1 */

  if (this.mti >= this.N) { /* generate N words at one time */
    var kk;

    if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
      this.init_genrand(5489); /* a default initial seed is used */

    for (kk=0;kk<this.N-this.M;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (;kk<this.N-1;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
    this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  /* Tempering */
  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);

  return y >>> 0;
}

/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function() {
  return (this.genrand_int32()>>>1);
}

/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function() {
  return this.genrand_int32()*(1.0/4294967295.0);
  /* divided by 2^32-1 */
}

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
  return this.genrand_int32()*(1.0/4294967296.0);
  /* divided by 2^32 */
}

/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function() {
  return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
  /* divided by 2^32 */
}

/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function() {
  var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
  return(a*67108864.0+b)*(1.0/9007199254740992.0);
}

/* These real versions are due to Isaku Wada, 2002/01/09 added */

module.exports = {
  MersenneTwister: MersenneTwister
}

},{}],6:[function(require,module,exports){
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

  original.card.getElementsByClassName('task-link')[0].setAttribute('href', "tasks/" + changed.title);
  original.card.getElementsByClassName('original-title')[0].value = changed.title;
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if ( req.status === 200 && req.readyState === 4 ) {
      if ( !req.responseText ) {
        var tooltip = original.card.getElementsByClassName('manual-tooltip')[0];
        original.card.getElementsByClassName('task-link')[0].setAttribute('href', "tasks/" + changed.original);
        original.card.getElementsByClassName('original-title')[0].value = changed.original;
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

  req.onreadystatechange = function() {
    if ( req.readyState === 4 && req.status === 200 ) {
      var res = JSON.parse(req.responseText);
      if ( res === false ) {
        console.log(res);
      }
    }
  };

  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', data._csrf);
  req.send(JSON.stringify(data));
  var elToRemove = document.getElementById('editable-card');
  elToRemove.parentNode.removeChild(elToRemove);
}
module.exports = init;

},{"./helpers":3}],7:[function(require,module,exports){
'use strict';

var helpers = require('./helpers');
var projectCards = require('./project_cards');
var mersenneTwister = require('./mersenne-twister');
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
						projRes[i].default_value = projRes[i].default_value.replace('$', '');
						container.innerHTML += Handlebars.templates['projectcards.hbs'](projRes[i]);
					}

					for (i = 0; i < container.childNodes.length; i++) {
						colorProject(container.childNodes[i]);
					}

					//Handle events dependant on rendered cards
					projectCards();
					//Fix all textarea heights so they are equal to content height
					fixTextareaHeight();

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
		var projectName = document.getElementById('project-name');

		if ( projectName.value.length <= 0  ) {
			projectName.value = generateName();
		}

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

function fixTextareaHeight() {
	var textAreas = document.getElementsByTagName('textarea');
	var scroll;
	for (var i = 0; i < textAreas.length; i++) {
		scroll = textAreas[i].scrollHeight;
		if (scroll > 150) {
			scroll = 150;
		}
		textAreas[i].style.height = scroll + 'px';

	}
}

function generateName(projectArr) {
	var ID_LENGTH = 10000;
	var projects = document.getElementsByClassName('project-card-name');
	var projectNames = [];
	if ( !projectArr ) {
		for (var i = 0; i < projects.length; i++) {
			projectNames.push(projects[i].value);
		}
	} else {
		projectNames = projectArr;
	}

	var mt = new mersenneTwister.MersenneTwister();

	var adjectives = ["Icy", "Hot", "Tropical", "Big", "Dark", "Shiny", "Hidden",
	                  "Golden", "Fast", "Elegant", "Ancient", "Thrilling", "Dusty", "Honest"];

	var nouns = ["Metal", "Creature", "Wood", "Light", "Wave", "Rocket", "Future",
	              "Storm", "Fire", "Mountain", "Ocean", "Forest", "Jungle", "Hero"];

	var rndA = Math.round(mt.random() * adjectives.length - 1);
	var rndB = Math.round(mt.random() * nouns.length - 1);
	var rndC = Math.round(mt.random() * ID_LENGTH);

	var name = adjectives[rndA] + " " + nouns[rndB] + " " + rndC;

	if ( projectNames.indexOf(name) >= 0 ) {
		name = generateName(projectNames);
	}
	return name;
}

},{"../templates":10,"./helpers":3,"./mersenne-twister":5,"./project_cards":6}],8:[function(require,module,exports){
'use strict';
var helpers = require('./helpers');

function attachEditors() {
  var editBtns = document.getElementsByClassName('task-edit-inner');
  for (var i = 0; i < editBtns.length; i++) {
    helpers.detectTouch(editBtns[i], displayEditor, true);
    helpers.detectTouch(editBtns[i].getElementsByClassName('delete')[0], deleteTasks, true);
  }
}

function displayEditor(event) {
  var parent = event.target.parentNode.parentNode;
  if (event.target.className === 'btn task-save' ) {
    var editIcon = parent.getElementsByClassName('task-edit-inner')[0];
    event.target.style.display = 'none';
    editIcon.style.display = 'inline';
    parent.getElementsByClassName('task-name')[0].disabled = true;
    updateTask(parent); //Save data
  } else {
    var saveBtn = parent.getElementsByClassName('task-save')[0];
    event.target.style.display = 'none';
    saveBtn.style.display = 'inline';
    parent.getElementsByClassName('task-name')[0].disabled = false;
    helpers.detectTouch(saveBtn, displayEditor, true);
  }
}

function updateTask(task) {
  var data = {
    _csrf: document.getElementById('csrf').value,
    task_name: task.getElementsByClassName('task-name')[0].value,
    project_name: task.getElementsByClassName('task-project-name')[0].innerHTML,
    start_time: task.getElementsByClassName('original-start-time')[0].value,
    original_name: task.getElementsByClassName('original-task-name')[0].value
  };
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if ( req.readyState === 4 && req.status === 200 ) {
      var res = req.responseText;
      console.log(res);
    }
  };

  req.open('PUT', '/tasks');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('csrfToken', data._csrf);
  req.send(JSON.stringify(data));
}

function deleteTasks() {
  
}

module.exports = {
  attachEditors: attachEditors
};

},{"./helpers":3}],9:[function(require,module,exports){
'use strict';

var helpers = require('./helpers');
var taskCards = require('./task_cards');
var Dropdown = require('./dropdown');
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
        color: window.getComputedStyle(document.getElementById('timer-project')).getPropertyValue('background-color'),
        isNew: true
      };

      var uniqueIDs = document.querySelectorAll('[id^="checkbox"]');

      newTask.unique_id = uniqueIDs[uniqueIDs.length-1].id;
      newTask.original_start_time = timeStamp.start;
      var uID = newTask.unique_id.substring(newTask.unique_id.indexOf('-') + 1);
      newTask.unique_id = newTask.unique_id.replace(newTask.unique_id.substring(newTask.unique_id.indexOf('-')), "-" + (Number(uID) + 1));

      if ( timeStamp.start.getMinutes() < 10 ) {
        newTask.start_time += '0';
      }

      if ( timeStamp.end.getMinutes() < 10 ) {
        newTask.end_time += '0';
      }

      newTask.start_time += timeStamp.start.getMinutes() + startAMPM;
      newTask.end_time += timeStamp.end.getMinutes() + endAMPM;

      if ( newTask.task_name.length < 1 ) {
        newTask.task_name = "(No description)";
      }

      deleteActive();// Delete active timer from DB

      var currPageProj = document.getElementById('project-name').innerHTML;
      currPageProj = currPageProj.substring(currPageProj.indexOf('\"') + 1, currPageProj.lastIndexOf('\"'));
      if ( newTask.project_name === currPageProj) {
        renderInOrder(newTask, timeStamp.end); //Insert at top
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
        var noTasks = document.getElementById('no-items');
        noTasks.remove();
        var ampm = "am";

        /* Generate all tasks */
        for ( var i = 0; i < res.length; i++) {
          var startTime = new Date(res[i].start_time);
          var endTime = new Date(res[i].end_time);
          res[i].original_start_time = res[i].start_time;

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

          res[i].unique_id = "checkbox-" + i;
          //Render the task in order
          renderInOrder(res[i], endTime);
        }
        /* Finish generating tasks */
        //Handle batch editor controls
        var dd = new Dropdown();
        dd.init();
        //Rendering tasks finished, so attach editor eventListeners
        taskCards.attachEditors();

        var tasks = document.getElementsByClassName('task');
        var projectName, projectColor;
        //Set each project labels text color based on the label color itself
        for ( i = 0; i < tasks.length; i++ ) {
          projectName = tasks[i].getElementsByClassName('task-project-name')[0];
          projectColor = helpers.rgbToHex(window.getComputedStyle(projectName).getPropertyValue('background-color'));
          projectName.style.color = helpers.computeContrast(projectColor);
          tasks[i].getElementsByClassName('total-time')[0].innerHTML = calcTotal(tasks[i], 2); //round
        }
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
  var minuteRate = valueNum / 60;
  var hoursToMinutes = hours * 60;
  //Calculate total billable
  var total = minuteRate * (minutes + hoursToMinutes); //Calculate total per minute
  var totalStr = "";
  if ( total < 10 ) {
    totalStr = '$0' + total.toFixed(decs);
  } else {
    totalStr = '$' + total.toFixed(decs);
  }
  return totalStr;
}

////////////////////////////////////
/* Create date header for sorting */
////////////////////////////////////
function renderInOrder(currTask, dateToSort) {
  var theDate = new Date(dateToSort);
  var dateConverter = new helpers.dateNameConverter();
  var currDate = dateConverter.dayName(theDate.getDay()) + " " + helpers.getOrdinal(theDate.getDate()) + " ";
  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  currDate += dateConverter.monthName(theDate.getMonth()) + ", " + theDate.getFullYear();

  today.setHours(0,0,0,0);
  theDate.setHours(0,0,0,0);
  if ( theDate.toDateString() === today.toDateString() ) {
    currDate = "Today";
  } else if ( theDate.toDateString() === yesterday.toDateString() ) {
    currDate = "Yesterday";
  }

  if ( !document.getElementById(currDate) ) {
    var newDateCollection = document.createElement('DIV');
    newDateCollection.className = "container";
    newDateCollection.id = currDate;
    newDateCollection.innerHTML += "<h2 class=\"date-heading\">" + currDate + "</h1>";
    newDateCollection.innerHTML += Handlebars.templates['batch_controller.hbs']();
    newDateCollection.innerHTML += Handlebars.templates['task.hbs'](currTask) + "<br>";
    document.getElementById('task-holder').appendChild(newDateCollection);
  } else if (currTask.isNew) {
    //Insert into top of current date container
    var heading = document.getElementById(currDate).getElementsByClassName('date-heading')[0].outerHTML;
    document.getElementById(currDate).innerHTML = heading + Handlebars.templates['task.hbs'](currTask) + "<br>" + document.getElementById(currDate).innerHTML.replace(heading, '');
  } else {
    document.getElementById(currDate).innerHTML += Handlebars.templates['task.hbs'](currTask) + "<br>";
  }
}

},{"../templates":10,"./dropdown":2,"./helpers":3,"./task_cards":8}],10:[function(require,module,exports){
require('./templates/projectcards');
require('./templates/task');
require('./templates/batch_controller');

},{"./templates/batch_controller":11,"./templates/projectcards":12,"./templates/task":13}],11:[function(require,module,exports){
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['batch_controller.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"dropdown batch-controller\">\n  <i class=\"dropdown-icon fa fa-wrench\"></i>\n  <ul class=\"dropdown-menu batch-menu\">\n    <li class=\"dropdown-action batch-action delete\">Delete Selected</li>\n    <li class=\"dropdown-action batch-action delete\">Bulk Edit</li>\n  </ul>\n</div>\n";
},"useData":true});
})();
},{}],12:[function(require,module,exports){
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
    + "\" disabled>\n	<a class=\"project-settings\"></a>\n	<button class=\"btn save\">Save</button>\n	<div class=\"tooltip-element\">\n		<div class=\"manual-tooltip\">\n			<p>A project with that name already exists</p>\n		</div>\n		<textarea type=\"text\" class=\"project-card-name\" disabled>"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "</textarea>\n	</div>\n\n	<textarea type=\"text\" class=\"project-card-description\" disabled>"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</textarea>\n	<span class=\"goto-tasks\">\n		<a href=\"tasks/"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "\" class=\"task-link\"><button style=\"background-color:#"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + "\">Go to tasks</button></a>\n	</span>\n	<div class=\"delete-container\">\n		<button class=\"btn delete\">Delete Project</button>\n		<span class=\"confirm\">\n			Are you sure?\n			<button id=\"project-delete-cancel\" class=\"btn\">No</button>\n			<button id=\"project-delete-confirm\" class=\"btn\">Yes</button>\n		</span>\n	</div>\n</div>\n";
},"useData":true});
})();
},{}],13:[function(require,module,exports){
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['task.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<div class=\"task\">\n  <input type=\"hidden\" class=\"original-task-name\" value=\""
    + alias4(((helper = (helper = helpers.task_name || (depth0 != null ? depth0.task_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"task_name","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"batch-container\">\n    <input id=\""
    + alias4(((helper = (helper = helpers.unique_id || (depth0 != null ? depth0.unique_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"unique_id","hash":{},"data":data}) : helper)))
    + "\" type=\"checkbox\" class=\"hidden-batch\">\n    <label class=\"task-batch\" for=\""
    + alias4(((helper = (helper = helpers.unique_id || (depth0 != null ? depth0.unique_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"unique_id","hash":{},"data":data}) : helper)))
    + "\"></label>\n  </div>\n  <div class=\"task-section task-info\">\n    <input type=\"text\" class=\"task-name inline reset-input-styles\" value=\""
    + alias4(((helper = (helper = helpers.task_name || (depth0 != null ? depth0.task_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"task_name","hash":{},"data":data}) : helper)))
    + "\" disabled>\n    <div class=\"project-name-outer\">\n      <span class=\"task-project-name inline\" style=\"background-color:"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + ";\">"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "</span>\n    </div>\n    <span class=\"task-value\">"
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
    + "</span>\n      <input type=\"hidden\" class=\"original-start-time\" value=\""
    + alias4(((helper = (helper = helpers.original_start_time || (depth0 != null ? depth0.original_start_time : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"original_start_time","hash":{},"data":data}) : helper)))
    + "\">\n    </div>\n    <div class=\"task-subsection inline\">\n      <span class=\"total-time\">$00.00</span>\n    </div>\n  </div>\n  <div class=\"task-edit\">\n    <i class=\"task-edit-inner fa fa-edit\"></i>\n    <button class=\"btn task-save\">Save</button>\n  </div>\n</div>\n";
},"useData":true});
})();
},{}]},{},[1]);
