/**
 * Module dependencies.
 */

var citizen = require('citizen');
// var feedback = require('feedback');
var log = require('debug')('democracyos:header:view');
var o = require('dom');
var snapper = require('snapper');
var template = require('./template');
var View = require('view');
var UserBadge = require('user-badge');
var Headroom = require('headroom');
var isMobile = require('is-mobile');

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

  if (isMobile()) {
    this.headroomBrowser = initHeadroom('#browser');
    this.headroomContent = initHeadroom('#content');
  }

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
  if (this.headroomBrowser) this.headroomBrowser.destroy();
  if (this.headroomContent) this.headroomContent.destroy();
  citizen.off('loaded');
  citizen.off('unloaded');
}

function initHeadroom(scroller) {
  var header = o('header').els[0];
  var aside = o('aside');
  scroller = o(scroller);
  var headroom = new Headroom(header, {
    scroller: scroller.els[0],
    onPin: function() {
      scroller.removeClass('content-pinned');
      aside.removeClass('content-pinned');
    },
    onUnpin: function() {
      scroller.addClass('content-pinned');
      aside.addClass('content-pinned');
    }
  });

  headroom.init();
  return headroom;
}