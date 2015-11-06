import 'native-promise-only';
import page from 'page';
import './timeago-fix'
import timeago from 'democracyos-timeago';
import debug from 'debug';
import config from '../config/config';

import '../translations/translations.js';

/**
 * Enable client-side debug messages
 */

import '../debug';

/**
 * Initialize debug for DemocracyOS
 */

let log = debug('democraycos:boot');

/**
 * Mount applications.
 */

import '../analytics';
<<<<<<< HEAD
import '../body-classes/body';
import '../content-lock/locker';
import '../header/header';
import '../help/help';
import '../signin/signin';
import '../signup/signup';
import '../forgot/forgot';
import '../notifications-page/notifications';
import '../logout/logout';
=======
import '../body-classes/body.js';
import '../content-lock/locker.js';
import '../header/header.js';
import '../help/help.js';
import '../signin/signin.js';
import '../signup/signup.js';
import '../forgot/forgot.js';
import '../notifications-page/notifications.js';
import '../logout/logout.js';
>>>>>>> [notifications] - Add notifications page. Close #1126
import '../auth-facebook/auth-facebook';
import '../settings/settings';
import '../forum/forum';
import '../admin/admin';
import '../homepage/homepage';
import '../newsfeed/newsfeed';
import '../topic/topic';
// require('proposal');
// require('404');

/**
 * Init `timeago` component with parameter locale
 */

timeago('.ago', { lang: config.locale, interval: 1000 });

/**
 * Render not found page.
 */

page('*', () => log('Should render Not found.'));

/**
 * Init page.js
 */

page();

if (config.googleAnalyticsTrackingId) {
  require('democracyos-ga')(config.googleAnalyticsTrackingId);
}
