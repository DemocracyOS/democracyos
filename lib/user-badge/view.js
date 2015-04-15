/**
 * Module dependencies.
 */

var citizen = require('citizen');
var template = require('./template');
var View = require('view');
var ToggleParent = require('toggle-parent');

/**
 * Expose view
 */

 module.exports = UserBadgeView;

 /**
 * Create `UserBadgeView` container
 */

function UserBadgeView() {
  View.call(this, template, {citizen: citizen});

  var dropdownBtn = this.find('.profile');
  var dropdown = new ToggleParent(dropdownBtn[0]);

  this.find('.dropdown-list').on('click', 'li', dropdown.hide);
}

View(UserBadgeView);