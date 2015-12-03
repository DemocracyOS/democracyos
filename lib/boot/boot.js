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
import '../body-classes/body';
import '../content-lock/locker';
import '../header/header';
import '../help/help';
import '../signin/signin';
import '../signup/signup';
import '../forgot/forgot';
import '../notifications-page/notifications';
import '../logout/logout';
import '../auth-facebook/auth-facebook';
import '../settings/settings';
import '../forum/forum';
import '../admin/admin';
import '../homepage/homepage';
import '../newsfeed/newsfeed';
import '../topic/topic';
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
