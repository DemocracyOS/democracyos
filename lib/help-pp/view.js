/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./pp.md');
var template = require('./pp-template');
var render = require('render');
var o = require('query');
var log = require('debug')('democracyos:help-pp');

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

  this.el = render.dom(template, { md: marked(md) });
}

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {PrivacyPolicyView|Element}
 * @api public
 */

PrivacyPolicyView.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    return this;
  };

  return this.el;
}