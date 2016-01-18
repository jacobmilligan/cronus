(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['task.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<div class=\"task\">\n  <input type=\"hidden\" class=\"original-task-name\" value=\""
    + alias4(((helper = (helper = helpers.task_name || (depth0 != null ? depth0.task_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"task_name","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"batch-container\">\n    <input id=\""
    + alias4(((helper = (helper = helpers.unique_id || (depth0 != null ? depth0.unique_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"unique_id","hash":{},"data":data}) : helper)))
    + "\" type=\"checkbox\" class=\"hidden-batch\">\n    <label class=\"task-batch\" for=\""
    + alias4(((helper = (helper = helpers.unique_id || (depth0 != null ? depth0.unique_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"unique_id","hash":{},"data":data}) : helper)))
    + "\"></label>\n  </div>\n  <div class=\"task-section task-info\">\n    <input type=\"text\" class=\"task-name inline reset-input-styles\" value=\""
    + alias4(((helper = (helper = helpers.task_name || (depth0 != null ? depth0.task_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"task_name","hash":{},"data":data}) : helper)))
    + "\" disabled>\n    <div class=\"project-name-outer\">\n      <span class=\"task-project-name inline\" style=\"background-color:"
    + alias4(((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper)))
    + ";\">"
    + alias4(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"project_name","hash":{},"data":data}) : helper)))
    + "</span>\n    </div>\n    <span class=\"task-value\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + " per hour</span>\n  </div>\n  <div class=\"task-section task-tags\"></div>\n  <div class=\"task-section task-elapsed\">\n    <div class=\"task-subsection inline\">\n      <span class=\"hours\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.elapsed : depth0)) != null ? stack1.hours : stack1), depth0))
    + "</span>:<span class=\"minutes\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.elapsed : depth0)) != null ? stack1.minutes : stack1), depth0))
    + "</span>:<span class=\"seconds\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.elapsed : depth0)) != null ? stack1.seconds : stack1), depth0))
    + "</span>\n    </div>\n    <div class=\"task-subsection inline\">\n      <span class=\"task-start\">"
    + alias4(((helper = (helper = helpers.start_time || (depth0 != null ? depth0.start_time : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"start_time","hash":{},"data":data}) : helper)))
    + "</span> - <span class=\"task-end\">"
    + alias4(((helper = (helper = helpers.end_time || (depth0 != null ? depth0.end_time : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"end_time","hash":{},"data":data}) : helper)))
    + "</span>\n      <input type=\"hidden\" class=\"original-start-time\" value=\""
    + alias4(((helper = (helper = helpers.original_start_time || (depth0 != null ? depth0.original_start_time : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"original_start_time","hash":{},"data":data}) : helper)))
    + "\">\n    </div>\n    <div class=\"task-subsection inline\">\n      <span class=\"total-time\">$00.00</span>\n    </div>\n  </div>\n  <div class=\"task-edit\">\n    <i class=\"task-edit-inner fa fa-edit\"></i>\n    <button class=\"btn task-save\">Save</button>\n  </div>\n</div>\n";
},"useData":true});
})();