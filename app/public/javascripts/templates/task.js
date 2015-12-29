(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['task.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<div class=\"task\">\n  <div class=\"task-name\">"
    + alias4(((helper = (helper = helpers.task_name || (depth0 != null ? depth0.task_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"task_name","hash":{},"data":data}) : helper)))
    + "</div>\n  <div class=\"task-project-name\">"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "</div>\n  <div class=\"task-value\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</div>\n  <div class=\"task-description\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\n  <div class=\"task-start\">"
    + alias4(((helper = (helper = helpers.start_time || (depth0 != null ? depth0.start_time : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"start_time","hash":{},"data":data}) : helper)))
    + "</div>\n  -\n  <div class=\"task-end\">"
    + alias4(((helper = (helper = helpers.end_time || (depth0 != null ? depth0.end_time : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"end_time","hash":{},"data":data}) : helper)))
    + "</div>\n  <div class=\"task-tags\"></div>\n  <i class=\"task-control fa fa-play fa-2x\"></i>\n  <div class=\"task-elapsed\">\n    <span class=\"hours\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.elapsed : depth0)) != null ? stack1.hours : stack1), depth0))
    + "</span>:<span class=\"minutes\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.elapsed : depth0)) != null ? stack1.minutes : stack1), depth0))
    + "</span>:<span class=\"seconds\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.elapsed : depth0)) != null ? stack1.seconds : stack1), depth0))
    + "</span>\n</div>\n";
},"useData":true});
})();