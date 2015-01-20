module.exports = {

  getToken: function() {
    return window.localStorage.getItem('token');
  },

  setToken: function(token) {
    window.localStorage.setItem('token', token);
  },

  clear: function() {
    window.localStorage.setItem('token', '');
  }

}