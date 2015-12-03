/**
 * Module dependencies.
 */

var Snap = require('democracyos-snap.js');
var bus = require('bus');
var dom = require('component-dom');

exports = module.exports = function refresh(ctx) {
  ctx = ctx || document;

  var snapper = new Snap({
    element: dom('#snap-content')[0],
    disable: 'right',
    touchToDrag: false,
    hyperextensible: false
  });

  var myToggleButton = dom('#toggleButton', ctx);

  if (myToggleButton) myToggleButton.on('click', function(e) {
    e.preventDefault();

    if('left' === snapper.state().state) {
      snapper.close();
    } else {
      snapper.open('left');
    }
  });

  bus.on('page:change', onPageChange);

  function onPageChange () {
    snapper.close();
  }

  exports.snapper = snapper;
  exports.close = snapper.close;
  exports.destroy = function () {
    bus.off('page:change', onPageChange);
  };
}
