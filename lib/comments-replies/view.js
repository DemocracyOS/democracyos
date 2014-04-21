/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var empty = require('empty');
var events = require('events');
var log = require('debug')('democracyos:comments-reply');
var o = require('query');
var commentsReplies = require('./comments-replies');
var commentsReply = require('./comments-reply');
var render = require('render');
var request = require('request');
var serialize = require('serialize');
var t = require('t');

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
  this.fetch();
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
  this.el = render.dom(commentsReplies, { comment: this.comment });
}


/**
 * Switch on events
 *
 * @api public
 */

CommentsRepliesView.prototype.switchOn = function() {
  this.events = events(this.el, this);
  this.events.bind('submit form.reply-form');
  this.events.bind('click a.btn-cancel', 'switchOff');
  this.on('post', this.add.bind(this));
}

/**
 * Switch off events
 *
 * @api public
 */

CommentsRepliesView.prototype.switchOff = function() {
  this.events.unbind();
  this.off('submit');
  this.off('post');
  this.el.parentNode.removeChild(this.el);
}

/**
 * Click event handler
 *
 * @param {Event} ev
 * @api private
 */

CommentsRepliesView.prototype.onreplyclick = function(ev) {
  this.fetch();
};

/**
 * Submit form handler
 *
 * @param {Event} ev
 * @api private
 */

CommentsRepliesView.prototype.onsubmit = function(ev) {
  ev.preventDefault();

  var data = serialize.object(ev.target);
  var errors = this.validate(data);
  this.errors(errors)
  if (errors.length) return log('Found errors: %o', errors);
  this.emit('submit', data);
  this.post(data);
};

/**
 * Add a reply
 *
 * @param {Event} ev
 * @api private
 */

CommentsRepliesView.prototype.add = function(reply) {
  var commentRepliesEl = o('.comment-replies', this.el);
  var commentsReplyEl = render.dom(commentsReply, { reply: reply });
  commentRepliesEl.appendChild(commentsReplyEl);
};


/**
 * Post a reply
 *
 * @param {Object} data
 * @api public
 */

CommentsRepliesView.prototype.post = function(data) {
  var view = this;

  request
  .post('/api/comment/' + this.comment.id + '/reply')
  .send({ reply: data })
  .end(function(err, res) {
    
    if (res.body && res.body.error) {
      return log('Fetch response error: %s', res.body.error), view.errors([res.body.error]);
    };

    if (err || !res.ok) return log('Fetch error: %s', err || res.error);

    view.emit('post', res.body);
    view.replies.push(res.body);
    view.switchOff();
  });
}

/**
 * Render element
 */

CommentsRepliesView.prototype.render = function(el) {
  var view = this;

  this.ready(function () {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    view.replies.forEach(function (reply) {
      view.add(reply);
    });

    empty(el).appendChild(view.el);
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

CommentsRepliesView.prototype.errors = function(errors) {
  this.state('error');
  
  var span = o('span.form-errors', this.el);
  errors = errors || [];

  empty(span);
  errors.forEach(function(err) {
    span.innerHTML += t(err);
  });

  // Unregister all `ready` listeners
  this.off('ready');
  return this;
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */
CommentsRepliesView.prototype.validate = function(data) {
  var errors = [];
  if (!data.text) {
    errors.push('Argument cannot be empty');
  };
  if (data.text.length > 4096) {
    errors.push('Argument is limited to 4096 characters');
  };
  return errors;
}