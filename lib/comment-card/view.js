
/**
 * Module dependencies.
 */

var citizen = require('citizen');
var config = require('config');
var markdown = require('markdown');
var template = require('./template');
var View = require('view');

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
}

View(CommentCard);

CommentCard.prototype.setLocals = function() {
  var locals = {};
  var comment = locals.comment = this.comment;
  locals.markdown = markdown;
  locals.likes = ~comment.upvotes.map(function(v) { return v.author; }).indexOf(citizen.id);
  locals.dislikes = ~comment.downvotes.map(function(v) { return v.author; }).indexOf(citizen.id);
  locals.flags = ~comment.flags.map(function(v) { return v.author; }).indexOf(citizen.id);
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

