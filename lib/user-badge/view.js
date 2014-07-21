/**
 * Module dependencies.
 */

var citizen = require('citizen');
var template = require('./template');
var View = require('view');

/**
 * Expose view
 */

 module.exports = UserBadgeView;

 /**
 * Create `UserBadgeView` container
 */

function UserBadgeView() {
  View.call(this, template, {citizen: citizen});
}

View(UserBadgeView);