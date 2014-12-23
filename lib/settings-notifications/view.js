/**
 * Module dependencies.
 */

var citizen = require('citizen');
var FormView = require('form-view')
var log = require('debug')('democracyos:settings-notifications');
var t = require('t');
var Toggle = require('toggle');
var template = require('./template');

/**
 * Expose NotificationsView
 */

module.exports = NotificationsView;

/**
 * Creates a password edit view
 */

function NotificationsView() {
  if (!(this instanceof NotificationsView)) {
    return new NotificationsView();
  };

  FormView.call(this, template);
  this.appendToggles();
}

/**
 * Inherit from `FormView`
 */

FormView(NotificationsView);


/**
 * Turn on event bindings
 */

NotificationsView.prototype.switchOn = function() {
  this.on('success', this.onsuccess.bind(this));
}

/**
 * Turn off event bindings
 */

NotificationsView.prototype.switchOff = function() {
  this.off();
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

NotificationsView.prototype.onsuccess = function() {
  log('Notification settings updated');
  this.messages([t('Your notifiction settings were successfuly updated')], 'success');
  citizen.load('me');
}

/**
 * Append toggle buttons
 */

NotificationsView.prototype.appendToggles = function() {
  var self = this;
  var names = [
    'new-topic',
    'replies',
    'mentions'
  ];
  names.forEach(function (name) {
    var toggle = new Toggle();
    toggle.label(t('Yes'), t('No'));
    toggle.name(name);
    if (citizen.notifications[name]) toggle.value(true);
    var el = self.el.find('.' + name);
    el.prepend(toggle.el);
  });
};