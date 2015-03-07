var cookie = require('cookie');
var config = require('config');
var domain = config.env == 'development' ? null : '.' + config.host;

module.exports = {

  getToken: function() {
    return cookie('token');
  },

  setToken: function(token) {
    cookie('token', token, { domain: domain });
  },

  clear: function() {
    cookie('token', null);
  }

}
