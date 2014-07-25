/**
 * Module dependencies.
 */

var inherit = require('inherit');
var Stateful = require('stateful');
var View = require('view');

/**
 * Expose `StatefulView`
 */

module.exports = StatefulView;

function StatefulView(template, options) {
  if (!(this instanceof StatefulView)) {
    return inherit(template, StatefulView);
  }

  View.call(this, template, options);
}

/**
 * Inherit from `View` and `Stateful`
 */

View(StatefulView);
Stateful(StatefulView);
