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
var o = require('query');
var Paragraphs = require('paragraphs');
var classes = require('classes');
var closest = require('closest');
var citizen = require('citizen');
var CommentsEditView = require('comments-edit');
var t = require('t');
var markdown = require('markdown');
var trunkata = require('trunkata');
var log = require('debug')('democracyos:comments-view');
var CommentsRepliesView = require('comments-replies');
var empty = require('empty');
var config = require('config');


/**
 * Expose comments view
 */

module.exports = CommentsView;

/**
 * Configure markdown
 */

markdown.setOptions({ gfm: true, breaks: true, sanitize: true, tables: false });

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
  this.page = 0;

  this.el = domify(block({
    citizen: citizen,
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
  this.events.bind('click a.btn-remove', 'onremove');
  this.events.bind('click a.btn-edit', 'onedit');
  this.events.bind('click a.cancel-remove', 'oncancelremove');
  this.events.bind('click a.confirm-remove', 'onconfirmremove');
  this.events.bind('click .message', 'onhidemessage');
  this.events.bind('click a.like', 'onlike');
  this.events.bind('click a.dislike', 'ondislike');
  this.events.bind('click a.flag', 'onflag');
  this.events.bind('click span.show-spam a', 'onshowspam');
  this.events.bind('click .comment-text a.read-more', 'readmore');
  this.events.bind('click a.comment-reply', 'onreplyclick');
  this.events.bind('click .load-arguments', 'fetch');
  this.on('fetch', this.load.bind(this));
  this.on('post', this.add.bind(this));
  this.on('no more comments', this.nomorecomments.bind(this));
  this.on('more comments', this.morecomments.bind(this));
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
  
  commentText.innerHTML = markdown(comment.text);
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
  classes(o('form.comment-form', this.el)).remove('has-error');

  span.innerHTML = '';
  errors.forEach(function(err) {
    span.innerHTML += t(err);
  });

  classes(o('form.comment-form', this.el)).add('has-error');
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
 * Show comment replies
 */

CommentsView.prototype.onreplyclick = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a');
  var commentEl = closest(target,'li[data-id]');
  var id = commentEl.getAttribute('data-id');
  var comment = get(this.comments, 'id === "%id"'.replace('%id', id));
  
  var repliesContainer = o('.replies-container', commentEl);
  if (repliesContainer.firstChild) {
    empty(repliesContainer);
    classes(target).remove('no-hide')
  } else {
    var commentsRepliesView = new CommentsRepliesView(comment);
    classes(target).add('no-hide')
    commentsRepliesView.render(repliesContainer);
    commentsRepliesView.on('post', this.newreply.bind(this))
    commentsRepliesView.on('remove', this.removereply.bind(this))
  }
}


/**
 * New reply submitted
 */

CommentsView.prototype.newreply = function(reply) {
  var replyEl = o('li[data-id=' + reply.id + ']', this.el);
  var commentEl = closest(replyEl, 'li.comment-item');
  var replyCounter = o('.reply-counter', commentEl);
  var counter = replyCounter.innerHTML != '' ? parseInt(replyCounter.innerHTML) : 0;
  var btnRemove = o('.comment-action.btn-remove', commentEl);
  classes(btnRemove).add('hide');
  counter++;
  replyCounter.innerHTML = counter;
}


/**
 * New reply submitted
 */

CommentsView.prototype.removereply = function(data) {
  var commentEl = o('li[data-id=' + data.commentId + ']', this.el);
  var replyCounter = o('.reply-counter', commentEl);
  var counter = replyCounter.innerHTML != '' ? parseInt(replyCounter.innerHTML) : 0;
  var btnRemove = o('.comment-action.btn-remove', commentEl);
  counter--;
  if (counter == 0) {
    classes(btnRemove).remove('hide');
    replyCounter.innerHTML = '';
  } else {
    replyCounter.innerHTML = counter;
  }
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
  .query({ page: this.page })
  .query({ limit: config['comments per page'] })
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
 * Initialize comments
 * 
 * @api public
 */

CommentsView.prototype.initialize = function() {
  var view = this;
  request
  .get(this.url() + '/comments')
  .query({ count: true })
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
    view.count = res.body;
    view.fetch();
  });
}

/**
 * When there are more comments to show
 * 
 * @api public
 */

CommentsView.prototype.morecomments = function() {
  var button = o('.load-arguments', this.el);
  classes(button).remove('hide');
}

/**
 * When there are no more comments to show
 * 
 * @api public
 */

CommentsView.prototype.nomorecomments = function() {
  var button = o('.load-arguments', this.el);
  classes(button).add('hide');
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
  if (!comments.length) return this.emit('no more comments');

  log('load %o', comments);

  this.page++;
  this.comments.push.apply(this.comments, comments);

  comments
  .sort(function(a, b) {
    var first = a.upvotes.length - a.downvotes.length;
    var second = b.upvotes.length - b.downvotes.length;
    var sort = (first - second);
    return 0 !== sort ? sort / Math.abs(sort) : sort;
  })
  .reverse()
  .forEach(function(comment) {
    this.add(comment);
  }, this);

  if (this.comments.length == this.count) {
    this.emit('no more comments');
  } else {
    this.emit('more comments')
  }

  this.emit('load');
}

/**
 * Add comment to block list
 */

CommentsView.prototype.add = function(comment) {
  var blockEl = o('ul.media-list.comment-list.main-list', this.el);
  var deletedBlockEl = o('ul.media-list.comment-list.deleted-list', this.el);
  var commentEl = domify(item({ comment: comment, citizen: citizen, t: t, markdown: markdown }));

  if (!comment.deleted) {
    blockEl.appendChild(commentEl);
    var el = o('.comment-text', commentEl);
    var oldLength = el.innerHTML.length;
    trunkata(el, { lines: 4 });
    var newLength = el.innerHTML.length;
    if (oldLength > newLength) {
      var a = document.createElement('a');
      classes(a).add('read-more');
      a.href = '#';
      a.innerHTML = t('read more');
      el.appendChild(a);
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
 * Show edit confirmation box
 *
 * @param {Event} ev
 * @api private
 */

CommentsView.prototype.onedit = function(ev) {
  ev.preventDefault();


  var target = ev.delegateTarget || closest(ev.target, 'a');
  var commentEl = closest(target, 'li[data-id]');

  classes(target).add('hide');


  var el = o('.media-body', commentEl);
  var form = o('form', el);

  if (!form) {
    var id = commentEl.getAttribute('data-id');
    var comment = get(this.comments, 'id === "%id"'.replace('%id', id));
    var commentsEdit = new CommentsEditView(comment);
    commentsEdit.render(el);
    commentsEdit.on('put', this.onsuccessedit.bind(this));
    commentsEdit.on('off', this.oncanceledit.bind(this));
  }

  classes(el).add('edit');
};


/**
 * Show remove confirmation box
 *
 * @param {Event} ev
 * @api private
 */

CommentsView.prototype.onremove = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a');
  var comment = closest(target, 'li[data-id]');
  classes(comment).add('remove');
  var btnEdit = o('.btn-edit', comment);
  classes(btnEdit).remove('hide');
  var mediaBody = o('.media-body', comment);
  classes(mediaBody).remove('edit');
};


/**
 * Hide remove confirmation box
 *
 * @param {Event} ev
 * @api private
 */

CommentsView.prototype.oncancelremove = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a.cancel-remove');
  var comment = closest(target, 'li[data-id]');
  classes(comment).remove('remove');
};


/**
 * Confirm comment removal
 *
 * @param {Event} ev
 * @api private
 */

CommentsView.prototype.onconfirmremove = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, 'a.cancel-remove');
  var comment = closest(target, 'li[data-id]');
  var id = comment.getAttribute('data-id');
  request
    .del('/api/comment/:id'.replace(':id', id))
    .end(function(err, res) {
      if (err) return log('Fetch error: %s', err);
      if (!res.ok) err = res.error, log('Fetch error: %s', err);
      if (res.body && res.body.error) err = res.body.error, log('Fetch response error: %s', err);

      classes(comment).remove('remove');
      var messageEl = o('.oncomment.message', comment);
      messageEl.style.display = 'block';
      if (err) {
        return messageEl.innerHTML = err;
      } else {
        log('successfull upvote %s', id);
        messageEl.innerHTML = t('Your argument was removed');
        setTimeout(function () {
          comment.remove();
        }, 2500)
      }
  });
};


/**
 * Hide error
 *
 * @param {Event} ev
 * @api private
 */

CommentsView.prototype.onhidemessage = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '.message');
  target.innerHTML = '';
  target.style.display = 'none';
};

CommentsView.prototype.oncanceledit = function(el) {
  classes(el.parentNode).remove('edit');
  var btn = o('.btn-edit', el.parentNode);
  classes(btn).remove('hide');
  el.parentNode.removeChild(el);
};

CommentsView.prototype.onsuccessedit = function(data) {
  var el = data.el;
  var data = data.data;

  var commentEl = el.parentNode;
  var id = commentEl.parentNode.getAttribute('data-id');
  var commentText = o('.comment-text', commentEl);
  var commentTime = o('.ago', commentEl);
  commentText.innerHTML = markdown(data.text);
  commentTime.setAttribute('data-time', data.editedAt.toString());

  var edited = o('.edited', commentEl);
  if (!edited) {
    var small = document.createElement('small');
    classes(small).add('edited');
    small.innerHTML = t('comments.edited');
    commentTime.parentNode.insertBefore(small, commentTime);
  }

  var btn = o('.btn-edit', commentEl.parentNode);
  classes(btn).remove('hide');
  classes(el.parentNode).remove('edit');
  commentEl.removeChild(el);

  var comment = get(this.comments, 'id === "%id"'.replace('%id', id));
  comment.text = data.text;
  comment.editedAt = data.editedAt;
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