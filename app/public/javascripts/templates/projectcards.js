(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['projectcards.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<span class=\"dollar-amt\">"
    + alias4(((helper = (helper = helpers.default_value || (depth0 != null ? depth0.default_value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"default_value","hash":{},"data":data}) : helper)))
    + "</span>\n<div class=\"dropdown-menu\">\n	<a class=\"project-settings\"></a>\n</div>\n<h2>"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "</h2>\n<p>"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "<p>\n<a href=\"tasks\"><button style=\"background-color:#"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + "\">Go to tasks</button></a>";
},"useData":true});
})();