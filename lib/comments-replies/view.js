/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var empty = require('empty');
var events = require('events');
var log = require('debug')('democracyos:comments-reply');
var o = require('query');
var commentsReplies = require('./comments-replies');
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

  this.state('initialized');
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
  this.fetch();
  this.emit('click', this);
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

CommentsRepliesView.prototype.renderReplies = function(el) {
  var view = this;

  this.ready(function () {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    var repliesEl = render.dom(commentsReplies, { replies: view.replies });
    empty(el).appendChild(repliesEl);

    return view;
  });
}

/**
 * Emit `ready` if collection has
 * completed a cycle of request
 *
 * @param {Function} fn
 * @return {Laws} Instance of `Laws`
 * @api public
 */

CommentsRepliesView.prototype.ready = function(fn) {
  var view = this;

  function done() {
    if ('loaded' === view.state()) {
      return fn();
    }
  }

  if ('loaded' === this.state()) {
    setTimeout(done, 0);
  } else {
    this.once('loaded', done);
  }

  return this;
}

/**
 * Save or retrieve current instance
 * state and emit to observers
 *
 * @param {String} state
 * @param {String} message
 * @return {CommentsRepliesView|String} Instance of `CommentsRepliesView` or current `state`
 * @api public
 */

CommentsRepliesView.prototype.state = function(state, message) {
  if (0 === arguments.length) {
    return this.$_state;
  }

  log('state is now %s', state);
  this.$_state = state;
  this.emit(state, message);
  return this;
};

/**
 * Fetch `laws` from source
 *
 * @param {String} src
 * @api public
 */

CommentsRepliesView.prototype.fetch = function(src) {
  log('request in process');
  src = src || '/api/comment/:id/replies'.replace(':id', this.comment.id);

  this.state('loading');

  request
  .get(src)
  .end(onresponse.bind(this));

  function onresponse(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load replies. Please try reloading the page. Thanks!';
      return this.error(message);
    };

    this.set(res.body);
  }
}

/**
 * Set replies to `v`
 *
 * @param {Array} v
 * @return {CommentsRepliesView} Instance of `CommentsRepliesView`
 * @api public
 */

CommentsRepliesView.prototype.set = function(v) {
  this.replies = v;
  this.state('loaded');
  return this;
}

/**
 * Handle errors
 *
 * @param {String} error
 * @return {CommentsRepliesView} Instance of `CommentsRepliesView`
 * @api public
 */

CommentsRepliesView.prototype.error = function(message) {
  // TODO: We should use `Error`s instead of
  // `Strings` to handle errors...
  // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
  this.state('error', message);
  log('error found: %s', message);

  // Unregister all `ready` listeners
  this.off('ready');
  return this;
}