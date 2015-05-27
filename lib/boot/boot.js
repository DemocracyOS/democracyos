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
var ua = require('user-agent');
var t = require('t');

/**
 * Initialize debug for DemocracyOS
 */

var log = require('debug')('democracyos:boot');

/**
 * Init `t` component with the locale provided by the server
 */

t[config.locale] = window.translations;
t.lang(config.locale);

/**
 * Mount applications.
 */

require('body-classes');
require('content-lock');
require('auth-facebook');
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

timeago('.ago', { lang: config.locale, interval: 1000 });

/**
 * Render not found page.
 */

page('*', function(ctx, next) {
  log('Should render Not found.');
});

/**
 * Init page.js
 */
page({click: !ua.ie().lte(9)});

if(config.googleAnalyticsTrackingId) {
	require('ga')(config.googleAnalyticsTrackingId);
}
