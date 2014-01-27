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

var config = require('config');
var page = require('page');
var timeago = require('timeago');
var translations = require('translations');
var snapper = require('snapper');
var bus = require('bus');
var ua = require('user-agent');
var t = require('t');

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
 * Close snapper on `page:change`
 */

bus.on('page:change', function() {
  snapper.close();
});

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
require('settings');

/**
 * Auth routes
 */

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
page({click: !ua.ie().lte(9)});

if(config['google analytics tracking id']) {
	require('ga')(config['google analytics tracking id']);
}