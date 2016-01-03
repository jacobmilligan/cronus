'use strict';

(function() {
  if ( window.location.href.indexOf('tasks') > -1 ) {
    getActiveTimer();
  }
})();

function getActiveTimer() {
  var req = new XMLHttpRequest();

  

  req.open('GET', '/active_tasks');
  req.send();
}
