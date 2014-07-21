/**
 * Module dependencies.
 */

var citizen = require('citizen');
// var feedback = require('feedback');
var log = require('debug')('democracyos:header:view');
var o = require('query');
var render = require('render');
var snapper = require('snapper');
var template = require('./template');
var View = require('view');
var UserBadge = require('user-badge')

/**
 * Expose HeaderView
 */

module.exports = HeaderView;

/**
 * Create Sidebar List view container
 */

function HeaderView() {
  View.call(this, template);

  this.user = this.el.find('.user');
}

View(HeaderView);

HeaderView.prototype.switchOn = function() {
  var self = this;
  snapper(this.el);
  citizen.on('loaded', function () {
    var userBadge = new UserBadge();
    userBadge.replace(self.user);
    self.el.find('.anonymous-citizen').addClass('hide');
  });
  citizen.on('unloaded', function () {
    self.user.empty();
    self.el.find('.anonymous-citizen').removeClass('hide');
  });
}

HeaderView.prototype.switchOff = function() {
  snapper.destroy();
  citizen.off('loaded');
  citizen.off('unloaded');
}