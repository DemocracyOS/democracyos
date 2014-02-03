/**
 * Module dependencies.
 */

var template = require('./sidebar-template');
var render = require('render');
var classes = require('classes');
var o = require("query");

module.exports = Sidebar;

/**
 * Creates `Sidebar` view for admin
 */
function Sidebar() {
  if (!(this instanceof Sidebar)) {
    return new Sidebar();
  };

  this.el = render.dom(template);
}

Sidebar.prototype.set = function(section) {
  this.unset();
  var select = o('a[href="/admin/' + section + '"]', this.el);
  if (select) classes(select).add('active');
};

Sidebar.prototype.unset = function() {
  var actives = o.all(".active", this.el);

  if (!actives) return this;

  for (var i = 0; i < actives.length; i++) {
    classes(actives[i]).remove('active');
  };

  return this;
};

Sidebar.prototype.render = function(el) {
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
