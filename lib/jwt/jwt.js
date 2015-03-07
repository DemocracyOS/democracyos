var store = require('store')();

var exports = module.exports;

exports.getToken = function getToken() {
  return store.get('token');
};

exports.setToken = function setToken(token) {
  store.set('token', token);
}

exports.clear = function clear() {
  store.remove('token');
}

if (window.access_token) {
  exports.setToken(window.access_token);
}
