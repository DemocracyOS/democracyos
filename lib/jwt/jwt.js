var cookie = require('cookie');

module.exports = {

  getToken: function() {
    return cookie('token');
  },

  setToken: function(token) {
    cookie('token', token);
  },

  clear: function() {
    cookie('token', null);
  }

}
