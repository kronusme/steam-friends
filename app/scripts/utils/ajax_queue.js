EmberAndFriends.AjaxQueue = Em.Object.extend({

  /**
   * List of requests
   * @type {Object[]}
   */
  queue: Em.A([]),

  /**
   * About query executing if some request failed
   * @type {bool}
   */
  abortOnError: true,

  /**
   * Function called after queue is complete
   * @type {callback}
   */
  finishedCallback: Em.K,

  /**
   * Object with <code>finishedCallback</code>
   * @type {Object}
   */
  finishedCallbackSender: null,

  /**
   * Add request to the <code>queue</code>
   * @param {Object} request object that uses in <code>EmberAndFriends.ajax.send</code>
   * @return {EmberAndFriends.AjaxQueue}
   * @method addRequest
   */
  addRequest: function(request) {
    Em.assert('Each ajax-request should has non-blank `name`', !Em.isBlank(Em.get(request, 'name')));
    Em.assert('Each ajax-request should has object `sender`', Em.typeOf(Em.get(request, 'sender')) !== 'object');
    this.get('queue').pushObject(request);
    return this;
  },

  /**
   * Add requests to the <code>queue</code>
   * @param {Object[]} requests list of objects that uses in <code>EmberAndFriends.ajax.send</code>
   * @return {EmberAndFriends.AjaxQueue}
   * @method addRequests
   */
  addRequests: function(requests) {
    requests.map(function(request) {
      this.addRequest(request);
    }, this);
    return this;
  },

  /**
   * Enter point to start requests executing
   * @method start
   */
  start: function() {
    this.runNextRequest();
  },

  /**
   * Execute first request from the <code>queue</code>
   * @method runNextRequest
   */
  runNextRequest: function() {
    var self = this;
    var queue = this.get('queue');
    if (queue.length === 0) {
      this.get('finishedCallbackSender')[this.get('finishedCallback')]();
      return;
    }
    var r = EmberAndFriends.ajax.send(queue.shift());
    this.propertyDidChange('queue');
    if (r) {
      r.complete(function(xhr) {
        if(xhr.status>=200 && xhr.status <= 299) {
          self.runNextRequest();
        }
        else {
          if (self.get('abortOnError')) {
            self.clear();
          }
          else {
            self.runNextRequest();
          }
        }
      });
    }
    else {
      if (this.get('abortOnError')) {
        this.clear();
      }
      else {
        this.runNextRequest();
      }
    }
  },

  /**
   * Remove all requests from <code>queue</code>
   * @method clear
   */
  clear: function() {
    this.get('queue').clear();
  }

});
