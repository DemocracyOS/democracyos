/**
 * Module dependencies.
 */

var block = require('./comments-block');
var item = require('./comment-item');
var serialize = require('serialize');
var request = require('request');
var toArray = require('to-array');
var Emitter = require('emitter');
var domify = require('domify');
var events = require('events');
var truncate = require('truncate');
var tip = require('tip')
var o = require('query');
var Paragraphs = require('paragraphs');
var classes = require('classes');
var closest = require('closest');
var citizen = require('citizen');
var t = require('t');
var log = require('debug')('democracyos:comments-view');


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
    citizen: citizen,
    context: context,
    reference: reference,
    t: t,
    truncate: truncate
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

CommentsView.prototype.render = function(el) {
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
 * Switch on events
 *
 * @api public
 */

CommentsView.prototype.switchOn = function() {
  this.events.bind('submit form.comment-form');
  this.events.bind('click .toggle-deleted-comments', 'toggleDeletedComments');
  this.events.bind('click a.like', 'onlike');
  this.events.bind('click a.dislike', 'ondislike');
  this.events.bind('click a.flag', 'onflag');
  this.events.bind('click span.show-spam a', 'onshowspam');
  this.events.bind('click .comment-text a.read-more', 'readmore');
  this.on('fetch', this.load.bind(this));
  this.on('post', this.add.bind(this));
}

/**
 * Read full comment
 *
 * @api public
 */

CommentsView.prototype.readmore = function(ev) {
  ev.preventDefault();

  var commentContainer = closest(ev.target,'li[data-id]');
  var id = commentContainer.getAttribute('data-id');
  var comment = get(this.comments, 'id === "%id"'.replace('%id', id));
  var commentText = o('.comment-text', commentContainer);
  
  commentText.innerHTML = new Paragraphs(comment.text).split();
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
  var errors = this.validate(data);
  this.errors(errors)
  if (errors.length) return log('Found errors: %o', errors);
  this.emit('submit', data);
  this.post(data);
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */
CommentsView.prototype.validate = function(data) {
  var errors = [];
  if (!data.text) {
    errors.push('Argument cannot be empty');
  };
  if (data.text.length > 4096) {
    errors.push('Argument is limited to 4096 characters');
  };
  return errors;
}

/**
 * Fill errors list
 *
 * @param {Array} errors
 * @api public
 */

CommentsView.prototype.errors = function(errors) {
  var span = o('span.help-text.form-errors', this.el);
  errors = errors || [];
  classes(o('form', this.el)).remove('has-error');

  span.innerText = '';

  span.innerText = '';
  errors.forEach(function(err) {
    span.innerText += t(err);
  });

  classes(o('form', this.el)).add('has-error');
}

/**
 * Action like comment
 */

CommentsView.prototype.onlike = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a');
  var comment = closest(target,'li[data-id]');
  var id = comment.getAttribute('data-id');
  var liked = classes(o('a.like', comment)).has('selected');
  var disliked = classes(o('a.dislike', comment)).has('selected');

  classes(target).add('selected');
  classes(o('a.dislike', comment)).remove('selected');

  var counter = o('.comment-counter', comment);
  var count = parseInt(counter.innerHTML, 10) || 0;
  count += disliked ? 2 : (liked ? 0 : 1);
  counter.innerHTML = count;

  request
  .post('/api/comment/:id/upvote'.replace(':id', id))
  .end(function(err, res) {
    if (err) return log('Fetch error: %s', err), classes(target).remove('selected');
    if (!res.ok) return log('Fetch error: %s', res.error), classes(target).remove('selected');
    if (res.body && res.body.error) return log('Fetch response error: %s', res.body.error), classes(target).remove('selected');
    log('successfull upvote %s', id);
  });
}

/**
 * Action dislike comment
 */

CommentsView.prototype.ondislike = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a');
  var comment = closest(target,'li[data-id]');
  var id = comment.getAttribute('data-id');
  var liked = classes(o('a.like', comment)).has('selected');
  var disliked = classes(o('a.dislike', comment)).has('selected');

  classes(target).add('selected');
  classes(o('a.like', comment)).remove('selected');

  var counter = o('.comment-counter', comment);
  var count = parseInt(counter.innerHTML, 10) || 0;
  count -= liked ? 2 : (disliked ? 0 : 1);
  counter.innerHTML = count;
  
  request
  .post('/api/comment/:id/downvote'.replace(':id', id))
  .end(function(err, res) {
    if (err) return log('Fetch error: %s', err), classes(target).remove('selected');
    if (!res.ok) return log('Fetch error: %s', res.error), classes(target).remove('selected');
    if (res.body && res.body.error) return log('Fetch response error: %s', res.body.error), classes(target).remove('selected');
    log('successfull downvote %s', id);
  });
}

/**
 * Action flag comment
 */

CommentsView.prototype.onflag = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a');
  var comment = closest(target,'li[data-id]');
  var id = comment.getAttribute('data-id');
  var flagged = classes(target).has('selected');

  classes(target).toggle('selected');
  flagged ? target.title=t('Spam') : target.title=t('Not spam');
  flagged ? classes(comment).remove('spam') : classes(comment).add('spam');
  
  request
  .post('/api/comment/:id/:action'.replace(':id', id).replace(':action', flagged ? 'unflag' : 'flag'))
  .end(function(err, res) {
    if (err) return log('Fetch error: %s', err), classes(target).remove('selected');
    if (!res.ok) return log('Fetch error: %s', res.error), classes(target).remove('selected');
    if (res.body && res.body.error) return log('Fetch response error: %s', res.body.error), classes(target).remove('selected');
    
    tip(target);
    log('successfull %s as spam %s', flagged ? 'unflag' : 'flag', id);
  });
}

/**
 * Show spam comment
 */

CommentsView.prototype.onshowspam = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a');
  var comment = closest(target,'li[data-id]');
  var id = comment.getAttribute('data-id');
  var flagged = classes(target).has('selected');
  flagged ? target.title=t('Spam') : target.title=t('Not spam');
    
  classes(comment).remove('spam');
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
  .end(function(err, res) {
    if (err) {
      log('Fetch error: %s', err);
      return;
    };
    if (!res.ok) {
      log('Fetch error: %s', res.error);
      return;
    };
    if (res.body && res.body.error) {
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
    
    if (res.body && res.body.error) {
      return log('Fetch response error: %s', res.body.error), view.errors([res.body.error]);
    };

    if (err || !res.ok) return log('Fetch error: %s', err || res.error);

    view.emit('post', res.body);
    view.comments.push(res.body);
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
  if (!comments.length) return;

  log('load %o', comments);

  this.comments.push.apply(this.comments, comments);

  this.comments
  .reverse()
  .sort(function(a, b) {
    var first = a.upvotes.length - a.downvotes.length;
    var second = b.upvotes.length - b.downvotes.length;
    var sort = (first - second);
    return 0 !== sort ? sort / Math.abs(sort) : sort;
  })
  .forEach(function(comment) {
    this.add(comment);
  }, this);

  this.emit('load');
}

/**
 * Add comment to block list
 */

CommentsView.prototype.add = function(comment) {
  var blockEl = o('ul.media-list.comment-list.main-list', this.el);
  var deletedBlockEl = o('ul.media-list.comment-list.deleted-list', this.el);
  var commentEl = domify(item({ comment: comment, citizen: citizen, t: t, truncate: truncate, paragraphs: new Paragraphs(null, 230, '... ', 2) }));

  if (!comment.deleted) {
    var flag = o('.flag', commentEl);
    tip(flag);
    if (blockEl.children.length) {
      blockEl.insertBefore(commentEl, blockEl.children[0]);
    } else {
      blockEl.appendChild(commentEl);
    } 
  } else {
    classes(o('.toggle-deleted-comments', this.el)).remove('hide');
    if (deletedBlockEl.children.length) {
      deletedBlockEl.insertBefore(commentEl, blockEl.children[0]);
    } else {
      deletedBlockEl.appendChild(commentEl);
    }
  }
}

/**
 * Clear form's inputs and textareas.
 *
 * @api public
 */

CommentsView.prototype.clear = function() {
  var els = o.all('input[type="text"], textarea', this.el);

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
 * Toggle deleted comments box
 *
 * @param {Event} ev
 * @api private
 */

CommentsView.prototype.toggleDeletedComments = function(ev) {
  ev.preventDefault();

  classes(o('ul.comment-list.deleted-list', this.el)).toggle('hide');
};

/**
 * Get api route
 */

CommentsView.prototype.url = function() {
  return "/api/{context}/{reference}"
    .replace('{context}', this.context)
    .replace('{reference}', this.reference);
}

function get(list, query) {
  var match;
  var test = new Function('_', 'return _.' + query);

  list.some(function(l) {
    if (test(l)) {
      match = l;
      return true;
    };
    return false;
  });
  return match || null;
}