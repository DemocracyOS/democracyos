/**
 * This JS is only a first release while testing
 * dynamic build of components for nodejs with
 * express.
 *
 * This should in near future adopt the same
 * developing architecture as
 *
 * http://github.com/component/component.io
 *
 * and
 *
 * http://github.com/hunterloftis/component-test
 *
 * It.
 */

var page = require('page');
var timeago = require('timeago');
var translations = require('translations');
var t = require('t');
var snap = require('Snap.js');


var snapper = new Snap({
    element: document.getElementById('snap-content'),
    disable: 'right',
    touchToDrag: false,
    hyperextensible: false
});

var myToggleButton =  document.getElementById('toggleButton');

if (jQuery("#myToggleButton").length>0) {

    myToggleButton.addEventListener('click', function(e){
    	e.preventDefault();

        if( snapper.state().state=="left" ){
            snapper.close();
        } else {
            snapper.open('left');
        }

    });

};

/**
 * Load localization dictionaries to translation application
 */

translations.help(t);

/**
 * Init `t` component with
 * locale as `es`
 */

t.lang('es');

/**
 * Mount applications.
 */
require('body-classes');
require('homepage');
require('proposal');
require('law');
require('signin');
require('signup');
require('forgot');

/**
 * Auth routes
 */

page('/auth/facebook', function(ctx, next) {
  window.location.replace(ctx.path);
});

page('/logout', function(ctx, next) {
  window.location.replace(ctx.path);
});

/**
 * Init `timeago` component with
 * locale as `es`
 */

timeago('.ago', { lang: 'es', interval: 10 });

/**
 * Render not found page.
 */

page('*', function(ctx, next) {
  console.log('Should render Not found.');
});

/**
 * Init page.js
 */

page();