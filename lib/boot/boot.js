
import page from 'page';
import timeago from 'timeago';
import bus from 'bus';
import UAParser from 'ua-parser-js';
import t from 't-component';
import debug from 'debug';
import config from '../config/config.js';
import translations from '../translations';

/**
 * Initialize debug for DemocracyOS
 */

let log = debug('democraycos:boot');

/**
 * Load localization dictionaries to translation application
 */

translations.help(t);

/**
 * Init `t` component with locale as `es`
 */

t.lang(config.locale);

/**
 * Mount applications.
 */

import '../body-classes/body.js';
import '../content-lock/locker.js';
import '../header/header.js';
import '../homepage/homepage.js';
// require('proposal');
import '../law/law.js';
import '../signin/signin.js';
import '../signup/signup.js';
import '../forgot/forgot.js';
import '../admin/admin.js';
import '../settings/settings.js';
import '../help/help.js';
import '../logout/logout.js';
// require('404');

/**
 * Init `timeago` component with parameter locale
 */

timeago('.ago', { lang: config.locale, interval: 1000 });

/**
 * Render not found page.
 */

page('*', (ctx, next) => log('Should render Not found.'));

/**
 * Init page.js
 */

var parser = new UAParser();
var browser = parser.getResult().browser;
page({ click: browser.name != 'Internet Explorer' && browser.version >= 9 })

if (config.googleAnalyticsTrackingId) {
	require('ga')(config.googleAnalyticsTrackingId);
}
