/**
 * Module dependencies.
 */

var loading = require('loading-lock');
var proto = loading.prototype;
var lock = proto.lock;
var unlock = proto.unlock;
var bus = require('bus');
var o = require('query');

loading.prototype.lock = function() {
  this.locked = true;
  lock.call(this);
};

loading.prototype.unlock = function() {
  if (this.locked) unlock.call(this);
  this.locked = false;
};

module.exports = exports = loading(o('#browser'), { size: 80 });

exports.lock();

bus.once('page:render', function() {
  exports.unlock();
});
