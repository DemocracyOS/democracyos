
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
  this.bind('click', '.new-comment', 'showNewComment');
  this.bind('click', '.cancel-new-comment', 'hideNewComment');
  this.comments.on('loaded', this.bound('oncommentsload'));
  this.mycomments.on('loaded', this.bound('onmycommentsload'));
  this.on('success', this.bound('onsuccess'));

};

CommentsView.prototype.switchOff = function() {
  this.comments.off('loaded', this.bound('oncommentsload'));
  this.mycomments.off('loaded', this.bound('onmycommentsload'));
};

CommentsView.prototype.oncommentsload = function() {
  comments.items.forEach(this.bound('add'));
};

CommentsView.prototype.onmycommentsload = function() {
  if (this.mycomments.items.length) {
    this.hideNewComment();
    this.mycomments.items.forEach(this.bound('addmycomment'));
  }
};

CommentsView.prototype.add = function(comment) {
  var card = new CommentCard(comment);
  var container = this.find('.comments-list')[0];
  card.appendTo(container);
};

CommentsView.prototype.addmycomment = function(comment) {
  var card = new CommentCard(comment);
  var container = this.find('.my-comments-list')[0];
  this.mycomments.items.push(comment);
  card.appendTo(container);
  card.on('delete', this.bound('removemycomment'));
};

CommentsView.prototype.removemycomment = function(comment) {
  var i = this.mycomments.items.indexOf(comment);
  this.mycomments.items.splice(i, 1);
  if (!this.mycomments.items.length) {
    this.find('.comment-form').removeClass('hide');
    this.find('.new-comment').addClass('hide');
    this.find('.cancel-new-comment').addClass('hide');
  }
};

CommentsView.prototype.onsuccess = function(res) {
  var comment = res.body;
  this.addmycomment(comment);
  this.hideNewComment();
}

CommentsView.prototype.showNewComment = function(ev) {
  ev.preventDefault();

  this.find('.comment-form').toggleClass('hide');
  this.find('.new-comment').addClass('hide');
};

CommentsView.prototype.hideNewComment = function() {
  this.textarea.val('');

  this.find('.comment-form').toggleClass('hide');
  this.find('.new-comment').removeClass('hide');
  this.find('span.error').remove();
  this.find('.error').removeClass('error');
};