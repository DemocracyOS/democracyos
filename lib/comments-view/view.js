
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
  this.mycomments = new Comments(law, 'my-comments');
  this.textarea = this.find('textarea');
}

/**
 * Inherit from FormView
 */

FormView(CommentsView);

CommentsView.prototype.switchOn = function() {
  this.comments.on('loaded', this.bound('oncommentsload'));
  this.mycomments.on('loaded', this.bound('onmycommentsload'));
  this.on('success', this.bound('onsuccess'));

};

CommentsView.prototype.switchOff = function() {
  this.comments.off('loaded', this.bound('oncommentsload'));
  this.mycomments.off('loaded', this.bound('onmycommentsload'));
};

CommentsView.prototype.oncommentsload = function() {
  this.comments.items.forEach(this.bound('add'));
};

CommentsView.prototype.onmycommentsload = function() {
  this.mycomments.items.forEach(this.bound('addmycomment'));
};

CommentsView.prototype.add = function(comment) {
  var card = new CommentCard(comment);
  var container = this.find('.comments-list')[0];
  card.appendTo(container);
};

CommentsView.prototype.addmycomment = function(comment) {
  var card = new CommentCard(comment);
  var container = this.find('.my-comments-list')[0];
  card.appendTo(container);
};

CommentsView.prototype.onsuccess = function(res) {
  var comment = res.body;
  this.addmycomment(comment);
  this.textarea.val('');
}