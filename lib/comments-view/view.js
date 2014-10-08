/**
 * Module dependencies.
 */

var block = require('./comments-block');
var item = require('./comment-item');
var serialize = require('serialize');
var request = require('request');
var toArray = require('to-array');
var Emitter = require('emitter');
var render = require('render');
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
var CommentsFilter = require('comments-filter');
var loading = require('loading-lock');


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
  this.filter = new CommentsFilter();
  this.sort = this.filter.getSort();

  this.el = render.dom(block, {
    context: context,
    reference: reference
  });

  this.comments = [];
  this.myArguments = [];

  this.events = events(this.el, this);
  this.build();
  this.switchOn();
}

/**
 * Mixin Emitter
 */

Emitter(CommentsView.prototype);


/**
 * Build
 */

CommentsView.prototype.build = function() {
  var container = o('h4.arguments', this.el);
  this.filter.render(container);
}

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
  this.events.bind('click .new-argument', 'newArgument')
  this.events.bind('click .cancel-new-argument', 'cancelNewArgument')
  this.on('fetch', this.load.bind(this));
  this.on('fetch my arguments', this.loadMyArguments.bind(this));
  this.on('post', this.addMyArgument.bind(this));
  this.on('no more comments', this.nomorecomments.bind(this));
  this.on('more comments', this.morecomments.bind(this));
  this.filter.on('change', this.onfilterchange.bind(this));
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
  if (!comment) {
    comment = get(this.myArguments, 'id === "%id"'.replace('%id', id));
  }
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
  var commentEl = closest(target,'li[data-id]');
  var id = commentEl.getAttribute('data-id');
  var comment = get(this.comments, 'id === "%id"'.replace('%id', id));
  if (!comment) {
    comment = get(this.myArguments, 'id === "%id"'.replace('%id', id));
  }
  var liked = classes(o('a.like', commentEl)).has('selected');
  var disliked = classes(o('a.dislike', commentEl)).has('selected');

  var error = o('.error', commentEl);

  if (comment.author.id == citizen.id) {
    return error.innerHTML = t('You\'re not allowed to vote your own argument');
  } else if (!citizen.id) {
    return error.innerHTML = t('comments.sign-in-required-to-vote-comments');
  } else {
    error.innerHTML = '';
  }

  classes(target).add('selected');
  classes(o('a.dislike', commentEl)).remove('selected');

  var counter = o('.comment-counter', commentEl);
  var count = parseInt(counter.innerHTML, 10) || 0;
  count += disliked ? 2 : (liked ? 0 : 1);
  counter.innerHTML = count;

  request
  .post('/api/comment/:id/upvote'.replace(':id', id))
  .end(function(err, res) {
    if (err || !res) return log('Fetch error: %s', err), classes(target).remove('selected');
    if (res.status == 401) return error.innerHTML = t(res.body.error);
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
  var commentEl = closest(target,'li[data-id]');
  var id = commentEl.getAttribute('data-id');
  var comment = get(this.comments, 'id === "%id"'.replace('%id', id));
  if (!comment) {
    comment = get(this.myArguments, 'id === "%id"'.replace('%id', id));
  }
  var liked = classes(o('a.like', commentEl)).has('selected');
  var disliked = classes(o('a.dislike', commentEl)).has('selected');

  var error = o('.error', commentEl);

  if (comment.author.id == citizen.id) {
    return error.innerHTML = t('You\'re not allowed to vote your own argument');
  } else if (!citizen.id) {
    return error.innerHTML = t('comments.sign-in-required-to-vote-comments');
  } else {
    error.innerHTML = '';
  }

  classes(target).add('selected');
  classes(o('a.like', commentEl)).remove('selected');

  var counter = o('.comment-counter', commentEl);
  var count = parseInt(counter.innerHTML, 10) || 0;
  count -= liked ? 2 : (disliked ? 0 : 1);
  counter.innerHTML = count;
  
  request
  .post('/api/comment/:id/downvote'.replace(':id', id))
  .end(function(err, res) {
    if (err) return log('Fetch error: %s', err), classes(target).remove('selected');
    if (res.status == 401) return error.innerHTML = t(res.body.error);
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
  var commentEl = closest(target,'li[data-id]');
  var id = commentEl.getAttribute('data-id');
  var comment = get(this.comments, 'id === "%id"'.replace('%id', id));
  var flagged = classes(target).has('selected');
  var alreadyFlagged = classes(commentEl).has('spam');

  classes(target).toggle('selected');
  flagged ? target.title=t('Spam') : target.title=t('Not spam');
  var flags = comment.flags.length + (flagged ? -1 : 1);

  if (config['spam limit']) {
    var spam = flags > config['spam limit'];
  } else {
    var spam = flags > (comment.upvotes.length - comment.downvotes.length)
  }
  spam ? classes(commentEl).add('spam') : classes(commentEl).remove('spam');
  
  request
  .post('/api/comment/:id/:action'.replace(':id', id).replace(':action', flagged ? 'unflag' : 'flag'))
  .end(function(err, res) {
    if (err) return handleError(err);
    if (!res.ok) return handleError(res.error);
    if (res.body && res.body.error) return handleError(res.body.error);
    
    log('successfull %s as spam %s', flagged ? 'unflag' : 'flag', id);
    var count = o('.count', target);
    var innerCount = count.innerHTML != '' ? parseInt(count.innerHTML) : 0;
    innerCount += (flagged ? -1 : 1)
    count.innerHTML = innerCount ? innerCount : '';

    function handleError(error) {
      log('Fetch response error: %s', error)
      if (alreadyFlagged) classes(commentEl).remove('spam');
      return classes(target).remove('selected');
    }
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
  if (!comment) {
    comment = get(this.myArguments, 'id === "%id"'.replace('%id', id));
  }
  
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
  this.loadingComments();
  request
    .get(view.url() + '/comments')
    .query({ page: view.page })
    .query({ sort: view.sort })
    .query({ limit: config['comments per page'] })
    .query({ exclude_user: citizen.id || null })
    .end(function(err, res) {
      view.unloadingComments();
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
  this.initializeArguments();
  this.initializeMyArguments();
}

/**
 * Load initial set of comments
 *
 * @api public
 */

CommentsView.prototype.initializeArguments = function() {
  this.page = 0;
  this.comments = [];
  classes(o('btn.load-arguments', this.el)).add('hide');
  var view = this;
  request
  .get(this.url() + '/comments')
  .query({ count: true })
  .query({ sort: this.sort })
  .query({ exclude_user: citizen.id || null })
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
};

/**
 * Load user's arguments
 *
 * @api public
 */

CommentsView.prototype.initializeMyArguments = function() {
  if (citizen.id) {
    var view = this;
    request
    .get(this.url() + '/my-comments')
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
      view.emit('fetch my arguments', res.body);
    });
  }
};

CommentsView.prototype.newArgument = function(ev) {
  ev.preventDefault();

  var el = o('.comment-form', this.el);
  classes(el).toggle('hide');
  classes(o('.new-argument', this.el)).add('hide');
};

CommentsView.prototype.cancelNewArgument = function(ev) {
  ev.preventDefault();

  var el = o('.comment-form', this.el);
  classes(el).toggle('hide');
  classes(o('.new-argument', this.el)).remove('hide');
};

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
 * When comments filter change,
 * re-fetch comments
 * 
 * @api public
 */

CommentsView.prototype.onfilterchange = function(sort) {
  this.sort = this.filter.getSort();
  this.initializeArguments();
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
  if (!comments.length) {
    var span = document.createElement('span');
    var text = citizen.id ? t('comments.no-citizen-comments') : t('comments.no-comments');
    span.innerHTML = text;
    classes(span).add('no-comments')
    var existing = o('.no-comments', this.el);
    if (existing) existing.remove();
    o('.main-list', this.el).insertBefore(span);
    return this.emit('no more comments');
  }

  log('load %o', comments);

  var els = o.all('ul.main-list li.comment-item', this.el);
  this.comments.push.apply(this.comments, comments);

  comments.forEach(function(comment) {
    this.add(comment);
  }, this);

  if (this.page == 0) {
    this.clearComments(els);
  }

  if (this.comments.length == this.count) {
    this.emit('no more comments');
  } else {
    this.emit('more comments')
  }

  this.page++;
  this.emit('load');
}

/**
 * Load comments in view's `el`
 *
 * @param {Array} comments
 * @api public
 */

CommentsView.prototype.loadMyArguments = function(comments) {
  if (comments.length) {
    var el = o('.comment-form', this.el);
    classes(el).add('hide');
    classes(o('.new-argument', this.el)).remove('hide');
  } else {
    classes(o('.cancel-new-argument', this.el)).add('hide');
  }

  comments.forEach(function (comment) {
    this.addMyArgument(comment);
  }, this);
};

/**
 * Add comment in view's `el`
 *
 * @param {Array} comments
 * @api public
 */

CommentsView.prototype.addMyArgument = function(comment) {
  classes(o('.cancel-new-argument', this.el)).remove('hide');
  var form = o('.comment-form', this.el);
  classes(form).add('hide');
  classes(o('.new-argument', this.el)).remove('hide');
  this.myArguments.unshift(comment);
  var blockEl = o('ul.my-arguments-list', this.el);
  var commentEl = render.dom(item, { comment: comment, markdown: markdown });

  blockEl.insertBefore(commentEl, blockEl.firstChild);
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
};

/**
 * Display a spinner when loading comments
 *
 * @api public
 */

CommentsView.prototype.loadingComments = function() {
  this.list = o('.inner-container', this.el);
  var self = this;
  self.spinner = loading(self.list, { size: 100 }).lock();
}

/**
 * Remove spinner when comments are loaded
 */

CommentsView.prototype.unloadingComments = function() {
  this.spinner.unlock();
};

/**
 * Add comment to block list
 */

CommentsView.prototype.add = function(comment) {
  var blockEl = o('ul.media-list.comment-list.main-list', this.el);
  var deletedBlockEl = o('ul.media-list.comment-list.deleted-list', this.el);
  var commentEl = render.dom(item, { comment: comment, markdown: markdown });

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
 * Clear comments
 *
 * @api public
 */

CommentsView.prototype.clearComments = function(els) {
  els.forEach(function (el) {
    el.parentNode.removeChild(el);
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
    var comment = get(this.myArguments, 'id === "%id"'.replace('%id', id));
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
  if (btnEdit) {
    classes(btnEdit).remove('hide');
  }
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
  var commentEl = closest(target, 'li[data-id]');
  var id = commentEl.getAttribute('data-id');
  var comment = get(this.myArguments, 'id === "%id"'.replace('%id', id));
  var i = this.myArguments.indexOf(comment);
  this.myArguments.splice(i, 1);
  var self = this;

  request
    .del('/api/comment/:id'.replace(':id', id))
    .end(function(err, res) {
      if (err) return log('Fetch error: %s', err);
      if (!res.ok) err = res.error, log('Fetch error: %s', err);
      if (res.body && res.body.error) err = res.body.error, log('Fetch response error: %s', err);

      classes(commentEl).remove('remove');
      var messageEl = o('.oncomment.message', commentEl);
      messageEl.style.display = 'block';
      if (err) {
        return messageEl.innerHTML = err;
      } else {
        log('successfull upvote %s', id);
        messageEl.innerHTML = t('The argument was removed');
        setTimeout(function () {
          commentEl.remove();
          if (!self.myArguments.length) {
            classes(o('.comment-form', self.el)).remove('hide');
            classes(o('.new-argument', self.el)).add('hide');
            classes(o('.cancel-new-argument', self.el)).add('hide');
          }
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

  var edited = o('.edited', commentEl);
  if (!edited) {
    var small = document.createElement('small');
    classes(small).add('edited');
    small.innerHTML = ' · ' + t('comments.edited');
    commentTime.parentNode.insertBefore(small, commentTime.nextSibling);
  }

  var btn = o('.btn-edit', commentEl.parentNode);
  classes(btn).remove('hide');
  classes(el.parentNode).remove('edit');
  commentEl.removeChild(el);

  var comment = get(this.myArguments, 'id === "%id"'.replace('%id', id));
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