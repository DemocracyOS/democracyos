
/**
 * Module dependencies.
 */

var citizen = require('citizen');
var config = require('config');
var o = require('dom');
var markdown = require('markdown');
var request = require('request');
var template = require('./template');
var CommentsEditView = require('comments-edit');
var CommentsRepliesView = require('comments-replies');
var View = require('view');
var t = require('t');
var log = require('debug')('democracyos:comments-view');

/**
 * Expose CommentCard
 */

module.exports = CommentCard;

/**
 * Create CommentCard
 */

function CommentCard(comment) {
  if (!(this instanceof CommentCard)) {
    return new CommentCard(comment);
  }

  this.comment = comment;
  this.setLocals();
  View.call(this, template, this.locals);

  this.likeButton = this.find('.vote-comment.like');
  this.dislikeButton = this.find('.vote-comment.dislike');
  this.editButton = this.find('.btn-edit');
  this.scoreCounter = this.find('.comment-counter');
  this.mediaBody = this.find('.media-body');
}

View(CommentCard);

CommentCard.prototype.switchOn = function() {
  this.bind('click', '.like', 'onlike');
  this.bind('click', '.dislike', 'ondislike');
  this.bind('click', '.link-report', 'onflag');
  this.bind('click', '.btn-edit', 'onedit');
  this.bind('click', '.btn-remove', 'onremove');
  this.bind('click', 'a.cancel-remove', 'oncancelremove');
  this.bind('click', 'a.confirm-remove', 'onconfirmremove');
  this.bind('click', 'span.show-spam a', 'onshowspam');
  this.bind('click', 'a.comment-reply', 'onreplyclick');
};

CommentCard.prototype.switchOff = function() {
  if (this.commentsRepliesView) {
    commentsRepliesView.off('post', this.bound('newreply'));
    commentsRepliesView.off('remove', this.bound('removereply'));
  }
};

CommentCard.prototype.setLocals = function() {
  var locals = {};
  var comment = locals.comment = this.comment;
  locals.markdown = markdown;
  locals.likes = !!~comment.upvotes.map(function(v) { return v.author; }).indexOf(citizen.id);
  locals.dislikes = !!~comment.downvotes.map(function(v) { return v.author; }).indexOf(citizen.id);
  locals.flags = !!~comment.flags.map(function(v) { return v.author; }).indexOf(citizen.id);
  locals.own = comment.author.id == citizen.id;
  locals.repliesCounter = comment.replies.length;
  if (config['spam limit']) {
    locals.spam = comment.flags.length > config['spam limit'];
  } else {
    locals.spam = comment.flags.length > (comment.upvotes.length - comment.downvotes.length);
  }
  locals.profilePictureUrl = comment.author.profilePictureUrl ? comment.author.profilePictureUrl : comment.author.gravatar;
  locals.classes = [];
  if (locals.own) locals.classes.push('own');
  if (locals.spam) locals.classes.push('spam');
  this.locals = locals;
};

/**
 * Action like comment
 */

CommentCard.prototype.onlike = function(ev) {
  ev.preventDefault();

  var comment = this.comment;
  var liked = this.locals.likes;
  var disliked = this.locals.dislikes;

  var error = this.find('.error');

  if (comment.author.id == citizen.id) {
    return error.html(t('You\'re not allowed to vote your own argument'));
  } else if (!citizen.id) {
    return error.html(t('comments.sign-in-required-to-vote-comments'));
  } else {
    error.html('');
  }

  this.likeButton.addClass('selected');
  this.dislikeButton.removeClass('selected');

  var count = parseInt(this.scoreCounter.html(), 10) || 0;
  count += disliked ? 2 : (liked ? 0 : 1);
  this.scoreCounter.html(count);

  this.locals.likes = true;
  this.locals.dislikes = false;

  var self = this;
  request
  .post(this.url() + '/upvote')
  .end(function(err, res) {
    if (err || !res) return log('Fetch error: %s', err), self.likeButton.removeClass('selected');
    if (res.status == 401) return error(t(res.body.error));
    if (!res.ok) return log('Fetch error: %s', res.error), self.likeButton.removeClass('selected');
    if (res.body && res.body.error) return log('Fetch response error: %s', res.body.error), self.likeButton.removeClass('selected');
    log('successfull upvote %s', self.comment.id);
  });
}



/**
 * Action like comment
 */

CommentCard.prototype.ondislike = function(ev) {
  ev.preventDefault();

  var comment = this.comment;
  var liked = this.locals.likes;
  var disliked = this.locals.dislikes;

  var error = this.find('.error');

  if (comment.author.id == citizen.id) {
    return error.html(t('You\'re not allowed to vote your own argument'));
  } else if (!citizen.id) {
    return error.html(t('comments.sign-in-required-to-vote-comments'));
  } else {
    error.html('');
  }

  this.dislikeButton.addClass('selected');
  this.likeButton.removeClass('selected');

  var count = parseInt(this.scoreCounter.html(), 10) || 0;
  count -= liked ? 2 : (disliked ? 0 : 1);
  this.scoreCounter.html(count);

  this.locals.dislikes = true;
  this.locals.likes = false;

  var self = this;
  request
  .post(this.url() + '/downvote')
  .end(function(err, res) {
    if (err || !res) return log('Fetch error: %s', err), self.dislikeButton.removeClass('selected');
    if (res.status == 401) return error(t(res.body.error));
    if (!res.ok) return log('Fetch error: %s', res.error), self.dislikeButton.removeClass('selected');
    if (res.body && res.body.error) return log('Fetch response error: %s', res.body.error), self.dislikeButton.removeClass('selected');
    log('successfull downvote %s', self.comment.id);
  });
}

CommentCard.prototype.onflag = function(ev) {
  ev.preventDefault();

  var comment = this.comment;
  var target = this.find('.link-report');
  var isSpam = this.locals.spam;
  var flagging = !this.locals.flags;

  target.toggleClass('selected');
  flagging ? target.attr('title', t('Not spam')) : target.attr('title', t('Spam'));
  var flagsCounter = comment.flags.length + (flagging ? 1 : -1);
  var spam;
  if (config['spam limit']) {
    spam = flagsCounter > config['spam limit'];
  } else {
    spam = flagsCounter > (comment.upvotes.length - comment.downvotes.length)
  }
  if (spam) {
    this.el.addClass('spam');
  } else {
    this.el.removeClass('spam');
  }

  var self = this;
  request
  .post(this.url() + '/:action'.replace(':action', flagging ? 'flag' : 'unflag'))
  .end(function(err, res) {
    if (err) return handleError(err);
    if (!res.ok) return handleError(res.error);
    if (res.body && res.body.error) return handleError(res.body.error);

    log('successfull %s as spam %s', flagging ? 'flag' : 'unflag', self.comment.id);
    var count = target.find('.count');
    var innerCount = count.html() != '' ? parseInt(count.html()) : 0;
    innerCount += (flagging ? 1 : -1)
    count.html(innerCount ? innerCount : '');
    self.locals.flags = flagging;

    function handleError(error) {
      log('Fetch response error: %s', error)
      if (flagging) self.el.removeClass('spam');
      return target.removeClass('selected');
    }
  });
}

CommentCard.prototype.onshowspam = function(ev) {
  ev.preventDefault();

  this.el.removeClass('spam');
}

CommentCard.prototype.onedit = function(ev) {
  ev.preventDefault();


  this.find('a.btn-edit').addClass('hide');
  var form = this.mediaBody.find('form');

  if (!form.length) {
    var commentsEdit = this.commentsEdit = new CommentsEditView(this.comment);
    commentsEdit.render(this.mediaBody[0]);
    commentsEdit.on('put', this.onsuccessedit.bind(this));
    commentsEdit.on('off', this.oncanceledit.bind(this));
  }

  this.mediaBody.addClass('edit');
};



CommentCard.prototype.oncanceledit = function(el) {
  this.mediaBody.removeClass('edit');
  this.find('.btn-edit').removeClass('hide');
  el.parentNode.removeChild(el);
};

CommentCard.prototype.onsuccessedit = function(data) {
  var el = data.el;
  var data = data.data;
  var commentText = this.find('.comment-text');
  var commentTime = this.find('.ago')[0];
  var edited = this.find('.edited');

  commentText.html(markdown(data.text));

  if (!edited.length) {
    var small = o('<small></small>');
    small.addClass('edited');
    small.html(' · ' + t('comments.edited'));
    commentTime.parentNode.insertBefore(small.els[0], commentTime.nextSibling);
  }

  this.find('.btn-edit').removeClass('hide');
  this.mediaBody.removeClass('edit');
  o(el).remove();

  this.comment.text = data.text;
  this.comment.editedAt = data.editedAt;
};

CommentCard.prototype.onremove = function(ev) {
  ev.preventDefault();

  this.el.addClass('remove');
  this.editButton.removeClass('hide');
  this.mediaBody.removeClass('edit');
};

CommentCard.prototype.oncancelremove = function(ev) {
  ev.preventDefault();

  this.el.removeClass('remove');
};


/**
 * Confirm comment removal
 *
 * @param {Event} ev
 * @api private
 */

CommentCard.prototype.onconfirmremove = function(ev) {
  ev.preventDefault();

  var comment = this.comment;
  var author = comment.author;
  var own = author.id == citizen.id;
  var self = this;
  var id = comment.id;

  request
    .del(this.url())
    .end(function(err, res) {
      if (err) return log('Fetch error: %s', err);
      if (!res.ok) err = res.error, log('Fetch error: %s', err);
      if (res.body && res.body.error) err = res.body.error, log('Fetch response error: %s', err);

      self.el.removeClass('remove');
      var messageEl = self.find('.oncomment.message');
      messageEl.css('display', 'block');
      if (err) {
        messageEl.html(err);
      } else {
        log('successfull upvote %s', id);
        messageEl.html(t('The argument was removed'));
        setTimeout(function () {
          self.el.remove();
          self.emit('delete', self.comment);
        }, 2500);
      }
  });
};

/**
 * Show comment replies
 */

CommentCard.prototype.onreplyclick = function(ev) {
  ev.preventDefault();

  var target = this.find('a.reply-comments');
  var repliesContainer = this.find('.replies-container');
  repliesContainer.empty().toggleClass('no-hide');
  if (repliesContainer.hasClass('no-hide')) {
    var commentsRepliesView = this.commentsRepliesView = new CommentsRepliesView(this.comment);
    commentsRepliesView.render(repliesContainer[0]);
    commentsRepliesView.on('post', this.bound('newreply'));
    commentsRepliesView.on('remove', this.bound('removereply'));
  }
}

/**
 * New reply submitted
 */

CommentCard.prototype.newreply = function(reply) {
  var replyCounter = this.find('.reply-counter');
  var counter = replyCounter.html() != '' ? parseInt(replyCounter.html()) : 0;
  this.find('.comment-action.btn-remove').addClass('hide');
  counter++;
  replyCounter.html(counter);
}

/**
 * Reply deleted
 */

CommentCard.prototype.removereply = function(data) {
  var replyCounter = this.find('.reply-counter');
  var counter = replyCounter.html() != '' ? parseInt(replyCounter.html()) : 0;
  var btnRemove = this.find('.comment-action.btn-remove');
  counter--;
  if (counter == 0) {
    btnRemove.removeClass('hide');
    replyCounter.html('');
  } else {
    replyCounter.html(counter);
  }
}

CommentCard.prototype.url = function() {
  return '/api/comment/:id'.replace(':id', this.comment.id);
};