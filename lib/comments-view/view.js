/**
 * Module dependencies.
 */

var block = require('./comments-block');
var item = require('./comment-item');
var serialize = require('serialize');
var request = require('superagent');
var toArray = require('to-array');
var Emitter = require('emitter');
var domify = require('domify');
var events = require('events');
var t = require('t');
var log = require('debug')('comments-view');

/**
 * Expose comments view
 */

module.exports = CommentsView;

/**
 * View constructor
 *
 * @param {String} context
 * @param {String} reference
 * @constructor
 */

function CommentsView(context, reference) {
  if (!(this instanceof CommentsView)) {
    return new CommentsView(context, reference);
  };

  this.context = context;
  this.reference = reference;

  this.el = domify(block({
    context: context,
    reference: reference,
    t: t
  }));

  this.comments = [];

  this.events = events(this.el, this);
  this.switchOn();
}

/**
 * Mixin Emitter
 */

Emitter(CommentsView.prototype);

/**
 * Description
 */

CommentsView.prototype.render = function() {
  return this.el;
}

/**
 * Switch on events
 *
 * @api public
 */

CommentsView.prototype.switchOn = function() {
  this.on('fetch', this.load.bind(this));
  this.on('post', this.add.bind(this));
  this.events.bind('submit form.comment-form');
}

/**
 * Switch off events
 *
 * @api public
 */

CommentsView.prototype.switchOff = function() {
  this.off('fetch');
  this.off('post');
  this.events.unbind();
}

/**
 * Submit event handler
 *
 * @param {Event} ev
 * @api private
 */

CommentsView.prototype.onsubmit = function(ev) {
  ev.preventDefault();

  var data = serialize.object(ev.target);
  if (!data.text) return;
  this.emit('submit', data);
  this.post(data);
}

/**
 * Fetch comments
 * 
 * @api public
 */

CommentsView.prototype.fetch = function() {
  var view = this;
  request
  .get(this.url() + '/comments')
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      log('Fetch error: %s', err);
      return;
    };
    if (!res.ok) {
      log('Fetch error: %s', res.error);
      return;
    };
    if (res.body.error) {
      log('Fetch response error: %s', res.body.error);
      return;
    };
    view.emit('fetch', res.body);
  });
}

/**
 * Post a comment
 *
 * @param {Object} data
 * @api public
 */

CommentsView.prototype.post = function(data) {
  var view = this;
  data.context = this.context;
  data.reference = this.reference;
  
  request
  .post(this.url() + "/comment")
  .send({ comment: data })
  .end(function(err, res) {
    if (err) {
      log('Fetch error: %s', err);
      return;
    };
    if (!res.ok) {
      log('Fetch error: %s', res.error);
      return;
    };
    if (res.body.error) {
      log('Fetch response error: %s', res.body.error);
      return;
    };

    view.emit('post', res.body);
    view.clear();
  });
}

/**
 * Load comments in view's `el`
 *
 * @param {Array} comments
 * @api public
 */

CommentsView.prototype.load = function(comments) {
  log('loading comments %o', comments);
  this.comments.push.apply(this.comments, comments);

  this.comments
  .reverse()
  .forEach(function(comment) {
    this.add(comment);
  }, this);

  this.emit('load');
}

/**
 * Add comment to block list
 */

CommentsView.prototype.add = function(comment) {
  var blockEl = this.el.querySelector('ul.media-list.comment-list');
  var commentEl = domify(item({ comment: comment, t: t }));

  if (blockEl.children.length) {
    blockEl.insertBefore(commentEl, blockEl.children[0]);
  } else {
    blockEl.appendChild(commentEl);
  }
}

/**
 * Clear form's inputs and textareas.
 *
 * @api public
 */

CommentsView.prototype.clear = function() {
  var els = this.el.querySelectorAll('input[type="text"], textarea');

  toArray(els).forEach(function(el) {
    switch ((el.tagName || el.nodeName).toLowerCase()) {
      case 'input':
      case 'textarea':
        el.value = '';
        break;
      case 'select':
        toArray(el.children)
          .forEach(function(option, i) {
            if (!i) return option.setAttribute('selected', 'selected');
            option.removeAttribute('selected');
          });
        break;
    }
  });
}
/**
 * Get api route
 */

CommentsView.prototype.url = function() {
  return "/api/{context}/{reference}"
    .replace('{context}', this.context)
    .replace('{reference}', this.reference);
}