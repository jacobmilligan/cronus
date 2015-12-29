'use strict';

(function() {
  var url = window.location.href;
  if ( url.indexOf('tasks') > -1 ) {
    getTasks();
  }
}());

function getTasks() {
  var req = new XMLHttpRequest();
  var url = window.location.href;
  var params = url.substring(url.lastIndexOf('/') + 1);

  req.onreadystatechange = function() {
    if ( req.readyState === 4 && req.status === 200 ) {
      var res = JSON.parse(req.responseText);
      document.getElementsByClassName('loader')[0].style.display = 'none';
      document.getElementsByClassName('container')[0].innerHTML = res[0].task_name;
    }
  };

  req.open('GET', '/tasks/' + params);
  req.send();
}
