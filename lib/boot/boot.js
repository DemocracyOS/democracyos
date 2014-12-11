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
var bus = require('bus');
var ua = require('user-agent');
var t = require('t');

/**
 * Load localization dictionaries to translation application
 */

translations.help(t);

/**
 * Init `t` component with locale as `es`
 */

t.lang(config['locale']);

/**
 * Mount applications.
 */

require('body-classes');
require('content-lock');
require('header');
require('homepage');
// require('proposal');
require('law');
require('signin');
require('signup');
require('forgot');
require('settings');
require('help');
require('admin');
require('logout');
// require('404');

/**
 * Init `timeago` component with parameter locale
 */

timeago('.ago', { lang: config['locale'], interval: 10 });

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