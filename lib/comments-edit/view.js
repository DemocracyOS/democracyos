/**
 * Module dependencies.
 */

var template = require('./template');
var FormView = require('form-view');
var isInViewport = require('is-in-viewport');
var o = require('dom');
var scroll = require('scroll-to');


/**
 * Expose comments view
 */

module.exports = CommentsEditView;

/**
 * View constructor
 *
 * @param {Comment} comment
 * @constructor
 */

function CommentsEditView(comment) {
  if (!(this instanceof CommentsEditView)) {
    return new CommentsEditView(comment);
  };

  this.comment = comment;
  FormView.call(this, template, { comment: comment });
}

/**
 * Extend from `View`
 */

FormView(CommentsEditView);

/**
 * Switch on events
 *
 * @api public
 */

CommentsEditView.prototype.switchOn = function() {
  this.bind('click', '.btn-cancel', 'oncancel');
  this.on('success', this.bound('onsuccess'));

  if (!isInViewport(this.el[0])) {
    var top = this.el[0].getBoundingClientRect().top - o('.app-header')[0].offsetHeight - 25 /* margin */;
    var options = { box: o('#browser')[0]};
    scroll(null, top, options);
  }
};

/**
 * Put a comment
 *
 * @param {Object} data
 * @api public
 */

CommentsEditView.prototype.onsuccess = function(res) {
  this.emit('put', res.body);
}

/**
 * On cancel editing a comment
 *
 * @param {Object} data
 * @api public
 */

 CommentsEditView.prototype.oncancel = function(ev) {
  ev.preventDefault();
  this.el.removeClass('edit');
  this.remove();
};