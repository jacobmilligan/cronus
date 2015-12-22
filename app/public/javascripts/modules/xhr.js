'use strict';

(function() {

	if ( window.location.href.indexOf('dashboard') > -1 ) {
		var projects = document.getElementById('projects');
		var noProjects = document.getElementById('no-projects');

		var projReq = new XMLHttpRequest();

		projReq.onreadystatechange = function() {
			if ( projReq.readyState === 4 && projReq.status === 200 ) {
				var projRes = JSON.parse(projReq.responseText);
				projects.style.display = 'block';
				projects.innerHTML = projRes;
			}
		};

		projReq.open('GET', 'projects');
		projReq.send();
	}

}());