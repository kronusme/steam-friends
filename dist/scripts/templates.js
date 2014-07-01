Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"container\">\n  <h1>Steam Friends Mapper</h1>\n  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("Get it!");
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n  ");
  hashContexts = {'progressBinding': depth0,'stripped': depth0,'animated': depth0};
  hashTypes = {'progressBinding': "STRING",'stripped': "BOOLEAN",'animated': "BOOLEAN"};
  options = {hash:{
    'progressBinding': ("controller.progress"),
    'stripped': (true),
    'animated': (true)
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bs-progress'] || depth0['bs-progress']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bs-progress", options))));
  data.buffer.push("\n");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n  <h4>Friend groups (");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "controller.formattedGroups.length", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(")</h4>\n  <table class=\"table table-striped table-bordered\">\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "group", "in", "controller.formattedGroups", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </table>\n");
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n      <tr><td>\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "user", "in", "group", {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </td></tr>\n    ");
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n          <img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "STRING"};
  options = {hash:{
    'src': ("user.avatar")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" />&nbsp;<a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "STRING"};
  options = {hash:{
    'href': ("user.profileurl")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "user.personaname", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</a>&nbsp;\n        ");
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "message", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("<br />");
  return buffer;
  }

  data.buffer.push("<div class=\"alert alert-dismissable alert-warning\">\n  Friend-list for users with \"not-public\" profiles can't be loaded.\n  So, some groups may not be fully completed.\n</div>\n\n<div class=\"alert alert-dismissable alert-warning\">\n  If user has too much friends, graph won't be very useful.\n</div>\n\n<form class=\"form-horizontal\" role=\"form\">\n  <div class=\"form-group\">\n    <label for=\"api-key\" class=\"col-sm-2 control-label\">API-key</label>\n    <div class=\"col-sm-6 controls\">\n      ");
  hashContexts = {'id': depth0,'classBinding': depth0,'valueBinding': depth0,'placeholder': depth0};
  hashTypes = {'id': "STRING",'classBinding': "STRING",'valueBinding': "STRING",'placeholder': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.apiKeyView", {hash:{
    'id': ("api-key"),
    'classBinding': ("isValid::error :form-control"),
    'valueBinding': ("controller.apiKey"),
    'placeholder': ("Enter your API-key")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" <small><a target=\"_blank\" href=\"http://steamcommunity.com/dev/apikey\">Get my key</a></small>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label for=\"steamid\" class=\"col-sm-2 control-label\">SteamID</label>\n    <div class=\"col-sm-3 controls\">\n      ");
  hashContexts = {'id': depth0,'classBinding': depth0,'valueBinding': depth0,'placeholder': depth0};
  hashTypes = {'id': "STRING",'classBinding': "STRING",'valueBinding': "STRING",'placeholder': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.steamIdView", {hash:{
    'id': ("steamid"),
    'classBinding': ("isValid::error :form-control"),
    'valueBinding': ("controller.steamid"),
    'placeholder': ("Enter Steam ID")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <div class=\"col-sm-offset-2 col-sm-10\">\n      ");
  hashContexts = {'disabledBinding': depth0,'type': depth0,'small': depth0,'clicked': depth0};
  hashTypes = {'disabledBinding': "STRING",'type': "STRING",'small': "STRING",'clicked': "STRING"};
  options = {hash:{
    'disabledBinding': ("view.submitDisabled"),
    'type': ("primary"),
    'small': ("true"),
    'clicked': ("submit")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['bs-button'] || depth0['bs-button']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bs-button", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    </div>\n  </div>\n</form>\n\n");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.unless.call(depth0, "controller.loadingComplete", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n\n");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "controller.formattedGroups.length", {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n\n<div id=\"graph\"></div>\n\n<h4>Work Log</h4>\n<pre class=\"pre-scrollable\">\n  ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "message", "in", "controller.workLog", {hash:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n</pre>");
  return buffer;
  
});