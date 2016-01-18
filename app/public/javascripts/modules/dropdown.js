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
