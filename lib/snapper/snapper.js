/**
 * Module dependencies.
 */

var Snap = require('Snap.js');

var snapper = module.exports = new Snap({
  element: document.getElementById('snap-content'),
  disable: 'right',
  touchToDrag: false,
  hyperextensible: false
});

var myToggleButton = document.getElementById('toggleButton');

myToggleButton && myToggleButton.addEventListener('click', function(e) {
  e.preventDefault();

  if("left" === snapper.state().state) {
    snapper.close();
  } else {
    snapper.open('left');
  }
});
