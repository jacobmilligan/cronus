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
    + "\" disabled>\n	<a class=\"project-settings\"></a>\n	<button class=\"btn save\">Save</button>\n	<div class=\"tooltip-element\">\n		<div class=\"manual-tooltip\">\n			<p>A project with that name already exists</p>\n		</div>\n		<input type=\"text\" class=\"project-card-name\" value=\""
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "\" disabled>\n	</div>\n\n	<textarea type=\"text\" class=\"project-card-description\" disabled>"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</textarea>\n	<span class=\"goto-tasks\">\n		<a href=\"tasks/"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "\" class=\"task-link\"><button style=\"background-color:#"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + "\">Go to tasks</button></a>\n	</span>\n	<div class=\"delete-container\">\n		<button class=\"btn delete\">Delete Project</button>\n		<span class=\"confirm\">\n			Are you sure?\n			<button id=\"project-delete-cancel\" class=\"btn\">No</button>\n			<button id=\"project-delete-confirm\" class=\"btn\">Yes</button>\n		</span>\n	</div>\n</div>\n";
},"useData":true});
})();