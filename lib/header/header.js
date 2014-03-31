/**
 * Module dependencies.
 */

var citizen = require('citizen');
var template = require('./header-container');
var snapper = require('snapper');
// var feedback = require('feedback');
var render = require('render');
var o = require('query');
var log = require('debug')('democracyos:header:view');

/**
 * Expose HeaderView
 */

module.exports = HeaderView;

/**
 * Create Sidebar List view container
 */

function HeaderView() {
  if (!(this instanceof HeaderView)) {
    return new HeaderView();
  };

  // Prep event handlers
  this.refresh = this.refresh.bind(this);

  this.build();
  this.switchOn();
}

HeaderView.prototype.build = function() {
  this.el = render.dom(template);
};

HeaderView.prototype.switchOn = function() {
  snapper(this.el);
  citizen.on('loaded', this.refresh);
  citizen.on('unloaded', this.refresh);
  // setTimeout(feedback.bind, 0);
}

HeaderView.prototype.switchOff = function() {
  snapper.destroy();
  citizen.off('loaded', this.refresh);
  citizen.off('unloaded', this.refresh);
}

HeaderView.prototype.refresh = function () {
  var old = this.el;
  this.switchOff();
  this.build();
  this.switchOn();

  if (old.parentNode) old.parentNode.replaceChild(this.el, old);
  old.remove();
}

HeaderView.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    // !!!: Should we return different things
    // on different conditions?
    // Or should we be consistent with
    // render returning always `this.el`
    return this;
  };

  return this.el;
}