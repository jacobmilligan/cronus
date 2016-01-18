(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['batch_controller.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"dropdown batch-controller\">\n  <i class=\"dropdown-icon fa fa-wrench\"></i>\n  <ul class=\"dropdown-menu batch-menu\">\n    <li class=\"dropdown-action batch-action delete\">Delete Selected</li>\n    <li class=\"dropdown-action batch-action delete\">Bulk Edit</li>\n  </ul>\n</div>\n";
},"useData":true});
})();