
/**
 * Module dependencies.
 */

var citizen = require('citizen');
var config = require('config');
var o = require('dom');
var markdown = require('marked');
var request = require('request');
var template = require('./template');
var CommentsEditView = require('comments-edit');
var CommentsRepliesView = require('comments-replies');
var View = require('view');
var t = require('t');
var log = require('debug')('democracyos:comments-view');
var CommentVote = require('comment-vote');

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

  this.initializeVote();
  this.editButton = this.find('.btn-edit');
  this.scoreCounter = this.find('.comment-counter');
  this.mediaBody = this.find('.media-body');
}

View(CommentCard);

CommentCard.prototype.switchOn = function() {
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
    this.commentsRepliesView.off('post', this.bound('newreply'));
    this.commentsRepliesView.off('delete', this.bound('removereply'));
  }
};

CommentCard.prototype.setLocals = function () {
  var locals = {};
  var comment = locals.comment = this.comment;
  locals.markdown = markdown;
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

CommentCard.prototype.initializeVote = function () {
  this.commentVote = new CommentVote(this.comment);
  this.el.find('.comment-actions').prepend(this.commentVote.render());
  this.commentVote.on('error', this.bound('voteError'));
  this.commentVote.on('loginrequired', this.bound('loginRequired'));
};

CommentCard.prototype.voteError = function (message) {
  message = message || '';
  this.find('.error')
  .css('display', 'block')
  .html(message);
};

CommentCard.prototype.loginRequired = function () {
  this.find('.loginrequired').css('display', 'block');
};

CommentCard.prototype.onflag = function(ev) {
  ev.preventDefault();

  var comment = this.comment;
  var target = this.find('.link-report');
  var isSpam = this.locals.spam;
  var flagging = !this.locals.flags;

  target.toggleClass('selected');
  flagging ? target.attr('title', t('comment-card.not-spam')) : target.attr('title', t('comment-card.report-spam'));
  var flagsCounter = comment.flags.length + (flagging ? 1 : -1);
  var spam;
  if (config['spam limit']) {
    spam = flagsCounter > config['spam limit'];
  } else {
    spam = flagsCounter > (comment.upvotes.length - comment.downvotes.length);
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
    innerCount += (flagging ? 1 : -1);
    count.html(innerCount ? innerCount : '');
    self.locals.flags = flagging;

    function handleError(error) {
      log('Fetch response error: %s', error);
      if (flagging) self.el.removeClass('spam');
      return target.removeClass('selected');
    }
  });
};

CommentCard.prototype.onshowspam = function(ev) {
  ev.preventDefault();

  this.el.removeClass('spam');
};

CommentCard.prototype.onedit = function(ev) {
  ev.preventDefault();


  this.find('a.btn-edit').addClass('hide');
  var form = this.mediaBody.find('form');

  if (!form.length) {
    var commentsEdit = this.commentsEdit = new CommentsEditView(this.comment);
    commentsEdit.appendTo(this.mediaBody[0]);
    commentsEdit.on('put', this.onsuccessedit.bind(this));
    commentsEdit.on('remove', this.oncanceledit.bind(this));
  }

  this.mediaBody.addClass('edit');
};


CommentCard.prototype.oncanceledit = function() {
  this.mediaBody.removeClass('edit');
  this.find('.btn-edit').removeClass('hide');
};

CommentCard.prototype.onsuccessedit = function(data) {
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
  this.commentsEdit.remove();

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
        messageEl.html(t('comments.removed'));
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
    commentsRepliesView.appendTo(repliesContainer[0]);
    commentsRepliesView.on('post', this.bound('newreply'));
    commentsRepliesView.on('delete', this.bound('removereply'));
    commentsRepliesView.on('remove', this.bound('cancelreply'));
  }
};

/**
 * New reply submitted
 */

CommentCard.prototype.newreply = function(reply) {
  var replyCounter = this.find('.reply-counter');
  var counter = replyCounter.html() != '' ? parseInt(replyCounter.html()) : 0;
  this.find('.comment-action.btn-remove').addClass('hide');
  counter++;
  replyCounter.html(counter);
};

/**
 * Cancel reply
 */

CommentCard.prototype.cancelreply = function() {
  var repliesContainer = this.find('.replies-container');
  repliesContainer.removeClass('no-hide');
};

/**
 * Reply deleted
 */

CommentCard.prototype.removereply = function(data) {
  var replyCounter = this.find('.reply-counter');
  var counter = replyCounter.html() != '' ? parseInt(replyCounter.html()) : 0;
  var btnRemove = this.find('.comment-action.btn-remove');
  counter--;
  if (!counter) {
    btnRemove.removeClass('hide');
    replyCounter.html('');
  } else {
    replyCounter.html(counter);
  }
};

CommentCard.prototype.url = function() {
  return '/api/comment/:id'.replace(':id', this.comment.id);
};