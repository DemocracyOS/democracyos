var cookie = require('cookie');
var domain = require('./domain').domain;

module.exports = {

  getToken: function getToken() {
    return cookie('token');
  },

  setToken: function setToken(token) {
    var expires = new Date(+new Date() + 1000 * 60 * 60 * 24 * 365);
    cookie('token', token, { domain: domain, expires: expires });
  },

  clear: function clear() {
    cookie('token', null, { domain: domain });
  },

  getLoginUrl: function(hostname) {
    // fixme: use buildUrl helper
    return hostname + '/signin/' + this.getToken();
  }

}
