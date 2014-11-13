/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./pp.md');
var template = require('./template');
var View = require('view');

/**
 * Expose PrivacyPolicyView
 */

module.exports = PrivacyPolicyView;

/**
 * Creates a Privacy Policy view
 */

function PrivacyPolicyView() {
  if (!(this instanceof PrivacyPolicyView)) {
    return new PrivacyPolicyView();
  };

  View.call(this, template, { md: marked(md) });
}

View(PrivacyPolicyView);