
/**
 * Module dependencies.
 */

var citizen = require('citizen');
var config = require('config');
var markdown = require('markdown');
var request = require('request');
var template = require('./template');
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
  this.scoreCounter = this.find('.comment-counter');
}

View(CommentCard);

CommentCard.prototype.switchOn = function() {
  this.bind('click', '.like', 'onlike');
  this.bind('click', '.dislike', 'ondislike');
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
    var spam = comment.flags.length > config['spam limit'];
  } else {
    var spam = comment.flags.length > (comment.upvotes.length - comment.downvotes.length);
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

CommentCard.prototype.url = function() {
  return '/api/comment/:id'.replace(':id', this.comment.id);
};