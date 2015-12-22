'use strict';

(function() {

	if ( window.location.href.indexOf('dashboard') > -1 ) {

		getProjects();
		console.log("obj");
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
							buildProject(projRes[i], projects);
						}

					} else {
						noProjects.style.display = 'block';
					}

				}
			};

			projReq.open('GET', 'projects');
			projReq.send();
	}

	function buildProject(pendingProject, parent) {
		var newItem = document.createElement('div');
		newItem.className = 'project-grid';
		pendingProject.default_value = pendingProject.default_value.replace('$', '');
		var htmlString = "<span class=\"dollar-amt\">" + pendingProject.default_value + "</span>";
		htmlString += "<a class=\"project-settings\"></a>";
		htmlString += "<h2>" + pendingProject.project_name + "</h2>\n";
		htmlString += "<p>" + pendingProject.description + "</p>\n";

		// Uncomment when db joins tags onto query
		/*
		if ( pendingProject.tags.length > 0 ) {
			htmlString += "<ul class=\"project-tag-list\">";
			for ( var j = 0; j < pendingProject.tags.length; j++ ) {
				htmlString += "<li>" + pendingProject.tags[j] + "</li>";
			}
			htmlString += "</ul>";
		}
		*/

		newItem.innerHTML = htmlString;
		parent.appendChild(newItem);
	}

}());