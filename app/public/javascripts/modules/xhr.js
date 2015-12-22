'use strict';

(function() {

	if ( window.location.href.indexOf('dashboard') > -1 ) {

		getProjects();
	}

	function getProjects() {
		var projects = document.getElementById('projects');
			var noProjects = document.getElementById('no-projects');

			var projReq = new XMLHttpRequest();

			projReq.onreadystatechange = function() {
				if ( projReq.readyState === 4 && projReq.status === 200 ) {
					var projRes = JSON.parse(projReq.responseText);

					if ( projRes.length > 0 ) {
						projects.style.display = 'block';
						for (var i = 0; i < projRes.length; i++) {
							projects.innerHTML += projRes[i].project_name;
							projects.innerHTML += projRes[i].description;
						}
					} else {
						noProjects.style.display = 'block';
					}

				}
			};

			projReq.open('GET', 'projects');
			projReq.send();
	}

	function buildProject() {
		
	}

}());