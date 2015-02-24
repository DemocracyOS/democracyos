var store = require('store')();

module.exports = {

  getToken: function() {
    return store.get('token');
  },

  setToken: function(token) {
    store.set('token', token);
  },

  clear: function() {
    store.remove('token');
  }

}