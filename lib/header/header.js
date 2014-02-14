/**
 * Module dependencies.
 */

var template = require('./header-container');
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

  // this.state('initializing');

  // // Prep event handlers
  // this.onfilterready = this.onfilterready.bind(this);

  // this.el = render.dom(sidebar);
  // this.events = events(this.el, this);

  // this.switchOn();
}

HeaderView.prototype.build = function() {
  this.el = render.dom(template);
};

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