/**
 * Module dependencies.
 */

var template = require('./sidebar-template');
var View = require('view');

module.exports = Sidebar;

/**
 * Creates `Sidebar` view for admin
 */
function Sidebar() {
  if (!(this instanceof Sidebar)) {
    return new Sidebar();
  };

  View.call(this, template);
}

View(Sidebar);

Sidebar.prototype.set = function(section) {
  this.unset();
  // Prune trailing subsection if they exist
  section = section && ~section.indexOf('/') ? section.split('/')[0] : section;
  var select = this.find('a[href="/admin/' + section + '"]').parent('li');
  select.addClass('active');
};

Sidebar.prototype.unset = function() {
  var actives = this.find(".active");
  actives.removeClass('active');

  return this;
};