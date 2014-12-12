
/**
 * Module dependencies.
 */

var citizen = require('citizen');
var CommentCard = require('comment-card');
var Comments = require('comments');
var FormView = require('form-view');
var template = require('./template');

/**
 * Expose CommentsView
 */

module.exports = CommentsView;

/**
 * Creates a CommentsView
 *
 * @param {String} reference
 */

function CommentsView(law) {
  if (!(this instanceof CommentsView)) {
    return new CommentsView(law);
  }

  this.law = law;

  FormView.call(this, template, {
    law: law
  });

  this.comments = new Comments(law, 'comments', { exclude_user: citizen.logged() ? citizen.id : null });
  // this.mycomments = new Comments('my-comments');
}

/**
 * Inherit from FormView
 */

FormView(CommentsView);

CommentsView.prototype.switchOn = function() {
  this.comments.on('loaded', this.bound('oncommentsload'));
};

CommentsView.prototype.switchOff = function() {
  this.comments.off('loaded', this.bound('oncommentsload'));
};

CommentsView.prototype.oncommentsload = function() {
  this.comments.items.forEach(this.bound('add'));
};

CommentsView.prototype.add = function(comment) {
  var card = new CommentCard(comment);
  var container = this.find('.all-comments')[0];
  card.appendTo(container);
};