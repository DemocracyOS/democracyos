/**
 * Module dependencies.
 */

var loading = require('loading-lock');
var bus = require('bus');
var o = function(query, context) {
  var el = context || document;
  return document.querySelector.call(el, query);
};

module.exports = exports = loading(o('#browser'), { size: 80 });

exports.lock();

bus.once('page:render', function() {
  exports.unlock();
});
