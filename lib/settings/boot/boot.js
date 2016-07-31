import 'native-promise-only'
import page from 'page'
import './timeago-fix'
import timeago from 'democracyos-timeago'
import debug from 'debug'
import config from '../../config/config'

import '../../translations/translations.js'

/**
 * Enable client-side debug messages
 */

import '../../debug'

/**
 * Initialize debug for DemocracyOS
 */

let log = debug('democraycos:boot')

/**
 * Mount applications.
 */
import '../../analytics'
import '../../body-classes/body'
import '../../content-lock/locker'
import '../../header/header/header'
import '../../error-pages/error-pages'
import '../../logout/logout'
import '../../site/auth-facebook/auth-facebook'
import '../../settings/settings/settings'
import '../../settings/forum-new/forum-new'
// import '../../404/404'

/**
 * Init `timeago` component with parameter locale
 */

timeago('.ago', { lang: config.locale, interval: 1000 })

/**
 * Init page.js
 */

page()

if (config.googleAnalyticsTrackingId) {
  require('democracyos-ga')(config.googleAnalyticsTrackingId)
}
