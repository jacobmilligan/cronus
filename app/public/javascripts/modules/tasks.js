'use strict';

(function() {
  if ( window.location.href.indexOf('tasks') > -1 ) {
    getTasks();
  }
}());

function getTasks() {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if ( req.readyState === 4 && req.status === 200 ) {
      var res = JSON.parse(req.responseText);
      document.getElementsByClassName('loader')[0].style.display = 'none';
      document.getElementsByClassName('container')[0].innerHTML = res.jacob;
    }
  };

  req.open('GET', '/tasks');
  req.send();
}
