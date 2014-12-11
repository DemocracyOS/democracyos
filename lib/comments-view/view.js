
/**
 * Module dependencies.
 */

var citizen = require('citizen');
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
  console.log(this.comments.items);
};
