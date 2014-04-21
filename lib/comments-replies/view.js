/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var events = require('events');
var log = require('debug')('democracyos:comments-reply');
var o = require('query');
var replies = require('./comments-replies');
var render = require('render');
var request = require('request');
var template = require('./template');


/**
 * Expose comments view
 */

module.exports = CommentsRepliesView;

/**
 * View constructor
 *
 * @constructor
 */

function CommentsRepliesView(comment) {
  if (!(this instanceof CommentsRepliesView)) {
    return new CommentsRepliesView();
  };

  this.comment = comment;
  
  this.build();
  this.switchOn();
}

/**
 * Mixin Emitter
 */

Emitter(CommentsRepliesView.prototype);

/**
 * Build component element
 *
 * @api public
 */

CommentsRepliesView.prototype.build = function() {
  this.el = render.dom(template, { comment: this.comment });
}


/**
 * Switch on events
 *
 * @api public
 */

CommentsRepliesView.prototype.switchOn = function() {
  this.events = events(this.el, this);
  this.events.bind('click a.comment-reply', 'onreplyclick');
}

/**
 * Switch off events
 *
 * @api public
 */

CommentsRepliesView.prototype.switchOff = function() {
  this.events.unbind();
}

/**
 * Click event handler
 *
 * @param {Event} ev
 * @api private
 */

CommentsRepliesView.prototype.onreplyclick = function(ev) {
  this.emit('click');
};

/**
 * Render element
 */

CommentsRepliesView.prototype.render = function(el) {
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

/**
 * Render replies on given element
 *
 * @param {Object} el
 * @api public
 */

CommentsRepliesView.prototype.replies = function(el) {
  
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    return this;
  };

  return this.el;
}