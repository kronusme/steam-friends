/**
 * Config for each ajax-request
 *
 * Fields example:
 *  mock - testMode url
 *  real - real url (without API prefix)
 *  type - request type (also may be defined in the format method)
 *  format - function for processing ajax params after default formatRequest. May be called with one or two parameters (data, opt). Return ajax-params object
 *  testInProduction - can this request be executed on production tests (used only in tests)
 *
 * @type {Object}
 */
var urls = {

  'load_friends': {
    real: 'proxy.php',
    type: 'POST',
    format: function(data) {
      return {
        data: {
          url: data.url
        }
      }
    }
  },

  'load_personal_info': {
    real: 'proxy.php',
    type: 'POST',
    format: function(data) {
      return {
        data: {
          url: data.url
        }
      }
    }
  }

};
/**
 * Replace data-placeholders to its values
 *
 * @param {String} url
 * @param {Object} data
 * @return {String}
 */
var formatUrl = function (url, data) {
  if (!url) return null;
  var keys = url.match(/\{\w+\}/g);
  keys = (keys === null) ? [] : keys;
  if (keys) {
    keys.forEach(function (key) {
      var raw_key = key.substr(1, key.length - 2);
      var replace;
      if (!data || !data[raw_key]) {
        replace = '';
      }
      else {
        replace = data[raw_key];
      }
      url = url.replace(new RegExp(key, 'g'), replace);
    });
  }
  return url;
};

/**
 * this = object from config
 * @return {Object}
 */
var formatRequest = function (data) {
  var opt = {
    type: this.type || 'GET',
    timeout: 180000,
    dataType: 'json',
    async: true
  };
  opt.url = formatUrl(this.real, data);

  if (this.format) {
    jQuery.extend(opt, this.format(data, opt));
  }
  return opt;
};

/**
 * Wrapper for all ajax requests
 *
 * @type {Object}
 */
var ajax = Em.Object.extend({
  /**
   * Send ajax request
   *
   * @param {Object} config
   * @return {$.ajax} jquery ajax object
   *
   * config fields:
   *  name - url-key in the urls-object *required*
   *  sender - object that send request (need for proper callback initialization) *required*
   *  data - object with data for url-format
   *  beforeSend - method-name for ajax beforeSend response callback
   *  success - method-name for ajax success response callback
   *  error - method-name for ajax error response callback
   *  callback - callback from <code>App.updater.run</code> library
   */
  send: function (config) {

    Ember.assert('Ajax sender should be defined!', config.sender);
    Ember.assert('Invalid config.name provided - ' + config.name, urls[config.name]);

    var opt = {},
      params = {};

    if (config.data) {
      jQuery.extend(params, config.data);
    }

    opt = formatRequest.call(urls[config.name], params);
    opt.context = this;

    // object sender should be provided for processing beforeSend, success, error and complete responses
    opt.beforeSend = function (xhr) {
      if (config.beforeSend) {
        config.sender[config.beforeSend](opt, xhr, params);
      }
    };

    opt.success = function (data) {
      console.log("TRACE: The url is: " + opt.url);
      if (config.success) {
        config.sender[config.success](data, opt, params);
      }
    };

    opt.error = function (request, ajaxOptions, error) {
      if (config.error) {
        config.sender[config.error](request, ajaxOptions, error, opt, params);
      }
    };

    opt.complete = function (xhr, status) {
      if (config.complete) {
        config.sender[config.complete](xhr, status);
      }
    };

    return $.ajax(opt);
  }

});

EmberAndFriends.ajax = ajax.create({});
