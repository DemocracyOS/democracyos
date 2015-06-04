import page from 'page';
import timeago from 'timeago';
import bus from 'bus';
import t from 't';
import debug from 'debug';
import config from '../config/config.js';
import translations from '../translations/translations.js';

/**
 * Initialize debug for DemocracyOS
 */

let log = debug('democraycos:boot');

/**
 * Mount applications.
 */

import '../body-classes/body.js';
import '../content-lock/locker.js';
import '../header/header.js';
import '../homepage/homepage.js';
import '../newsfeed/newsfeed.js';
import '../forum/forum.js';
import '../auth-facebook/auth-facebook';
// require('proposal');
import '../topic/topic.js';
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

page();

if (config.googleAnalyticsTrackingId) {
	require('ga')(config.googleAnalyticsTrackingId);
}
