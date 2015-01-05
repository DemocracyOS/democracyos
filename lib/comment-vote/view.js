var template = require('./template');
var request = require('request');
var Emitter = require('emitter');
var events = require('events');
var t = require('t');
var dom = require('dom');
var log = require('debug')('democracyos:comment-vote');
var View = require('view');
var citizen = require('citizen');

function CommentVote(comment) {
  if (!(this instanceof CommentVote)) {
    return new CommentVote(comment);
  }

  View.call(this, template);
  this.count = 0;
  this.comment = comment;
  this.likeButton = this.find('.vote.up');
  this.dislikeButton = this.find('.vote.down');
  this.scoreCounter = this.find('.counter');

  // Posible values: 'upvote','downvote','unvote';
  this.status = '';

  //Calculate the current comment scoring
  this.updateCount(this.comment.upvotes.length - this.comment.downvotes.length);


  if (this.hasVoted(this.comment.upvotes)) {
    this.updateStatus('upvote');
  }

  if (this.hasVoted(this.comment.downvotes)) {
    this.updateStatus('downvote');
  }
}

View(CommentVote);

/**
 * Turn on event bindings
 * called when inserted to DOM
 */
CommentVote.prototype.switchOn = function () {
  this.bind('click', '.up', 'onUpVote');
  this.bind('click', '.down', 'onDownVote');
};

/**
 * Turn off event bindings
 * called when removed from DOM
 */
CommentVote.prototype.switchOff = function () {
  this.unbind('click', '.up', 'onUpVote');
  this.unbind('click', '.down', 'onDownVote');
};

CommentVote.prototype.hasVoted = function (collection) {
  return !!~ collection.map(function (v) { return v.author; }).indexOf(citizen.id);
};

CommentVote.prototype.validateVote = function () {
  if (this.comment.author.id === citizen.id) {
    this.onError(t('You\'re not allowed to vote your own argument'));
    return false;
  } else if (!citizen.id) {
    this.onError(t('comments.sign-in-required-to-vote-comments'));
    return false;
  }
  //Clean up the error container
  this.emit('CommentVote:error-clean');
  return true;
};

CommentVote.prototype.onUpVote = function (ev) {
  ev.preventDefault();
  if (this.validateVote()) {
    if (this.status !== 'upvote') {
      this.updateVote('upvote');
      if (this.status === 'downvote') {
        this.updateCount(2); // up 2 times
      } else {
        this.updateCount(1);
      }
      this.updateStatus('upvote');
    } else {
      this.updateVote('unvote');
      this.updateCount(-1);
      this.updateStatus('unvote');
    }
  }
};

CommentVote.prototype.onDownVote = function (ev) {
  ev.preventDefault();
  if (this.validateVote()) {
    if (this.status !== 'downvote') {
      this.updateVote('downvote');

      if (this.status === 'upvote') {
        this.updateCount(-2); // down 2 times
      } else {
        this.updateCount(-1);
      }
      this.updateStatus('downvote');

    } else {
      this.updateVote('unvote');
      this.updateCount(1);
      this.updateStatus('unvote');
    }
  }
};

CommentVote.prototype.onError = function (message) {
  this.emit('CommentVote:error', message);
};

/**
 * Add or subtract the value on the current count.
 * Update dom element with the current value.
 * @param {Number} value
 */
CommentVote.prototype.updateCount = function (value) {
  this.count = this.count + value;
  this.scoreCounter.text(this.count);
};

CommentVote.prototype.updateStatus = function (status) {
  this.status = status;
  this.likeButton.removeClass('selected');
  this.dislikeButton.removeClass('selected');

  if (status === 'upvote') {
    this.likeButton.addClass('selected');
  }
  if (status === 'downvote') {
    this.dislikeButton.addClass('selected');
  }
};

/**
 * Call the api to update the vote comment .
 */
CommentVote.prototype.updateVote = function (url) {
  var self = this;
  request
      .post(this.url() + '/' + url)
      .end(function (err, res) {

        if (err || !res) {
          log('Fetch error: %s', err);
          return;
        }

        if (res.status === 401) {
          self.onError(t(res.body.error));
          return;
        }

        if (!res.ok) {
          log('Fetch error: %s', res.error);
          return;
        }

        if (res.body && res.body.error) {
          log('Fetch response error: %s', res.body.error);
          return;
        }

        log('successfull %s %s',url, self.comment.id);
      });
};

CommentVote.prototype.url = function () {
  return '/api/comment/:id'.replace(':id', this.comment.id);
};

/**
 * Expose comments view
 */
module.exports = CommentVote;