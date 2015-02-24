/**
 * Module dependencies.
 */

var citizen = require('citizen');
var request = require('request');
var t = require('t');
var template = require('./template');
var View = require('view');
var log = require('debug')('democracyos:comment-vote');

/**
 * Constructor
 */

function CommentVote(comment) {
  if (!(this instanceof CommentVote)) {
    return new CommentVote(comment);
  }

  View.call(this, template);
  // Posible values: 'upvote','downvote','unvote';
  this.$_status = '';
  this.$_count = 0;

  this.comment = comment;
  this.upvoteButton = this.find('.vote.up');
  this.downvoteButton = this.find('.vote.down');
  this.counter = this.find('.counter');

  //Calculate the current comment scoring
  this.count(this.comment.upvotes.length - this.comment.downvotes.length);


  if (this.voted(this.comment.upvotes)) {
    this.status('upvote');
  }

  if (this.voted(this.comment.downvotes)) {
    this.status('downvote');
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

CommentVote.prototype.voted = function (collection) {
  return !!~ collection.map(function (v) { return v.author; }).indexOf(citizen.id);
};

CommentVote.prototype.validate = function () {
  if (this.comment.author.id === citizen.id) {
    this.error(t('comments.score.not-allowed'));
    return false;
  } else if (!citizen.id) {
    this.loginRequired();
    return false;
  }

  //Clean up the error container
  this.emit('message', '');
  return true;
};

CommentVote.prototype.onUpVote = function (ev) {
  ev.preventDefault();

  if (this.validate()) {
    if (this.status() !== 'upvote') {
      this.vote('upvote');
      if (this.status() === 'downvote') {
        this.count(2); // up 2 times
      } else {
        this.count(1);
      }
      this.status('upvote');
    } else {
      this.vote('unvote');
      this.count(-1);
      this.status('unvote');
    }
  }
};

CommentVote.prototype.onDownVote = function (ev) {
  ev.preventDefault();

  if (this.validate()) {
    if (this.status() !== 'downvote') {
      this.vote('downvote');

      if (this.status() === 'upvote') {
        this.count(-2); // down 2 times
      } else {
        this.count(-1);
      }
      this.status('downvote');

    } else {
      this.vote('unvote');
      this.count(1);
      this.status('unvote');
    }
  }
};

CommentVote.prototype.error = function (error) {
  this.emit('error', error);
};

CommentVote.prototype.loginRequired = function() {
  this.emit('loginrequired');
};

/**
 * Add or subtract the value on the current count.
 * Update dom element with the current value.
 * @param {Number} value
 */
CommentVote.prototype.count = function (value) {
  if (arguments.length == 0) {
    return this.$_count;
  }

  this.$_count += value;
  this.counter.text(this.$_count);
};

CommentVote.prototype.status = function (status) {
  if (arguments.length == 0) {
    return this.$_status;
  }

  this.$_status = status;
  this.upvoteButton.removeClass('selected');
  this.downvoteButton.removeClass('selected');

  if (status === 'upvote') {
    this.upvoteButton.addClass('selected');
  }
  if (status === 'downvote') {
    this.downvoteButton.addClass('selected');
  }
};

/**
 * Call the api to update the vote comment .
 */
CommentVote.prototype.vote = function (voting) {
  var self = this;

  request
    .post(this.url(voting))
    .end(function (err, res) {

      if (err || !res) {
        log('Fetch error: %s', err);
        return;
      }

      if (res.status === 401) {
        self.error(t(res.body.error));
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

      log('successfull %s %s', voting, self.comment.id);
    });
};

CommentVote.prototype.url = function (voting) {
  return '/api/comment/:id/:voting'
    .replace(':id', this.comment.id)
    .replace(':voting', voting);
};

/**
 * Expose comments view
 */
module.exports = CommentVote;