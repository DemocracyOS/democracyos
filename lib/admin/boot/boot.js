import 'native-promise-only'
import page from 'page'
import './timeago-fix'
import timeago from 'democracyos-timeago'
import config from '../../config/config'

import '../../translations/translations.js'

/**
 * Mount applications.
 */

import '../../settings-routes'
import '../../site-routes'
import '../../forum/forum'
import '../../admin/admin/admin'
import '../../analytics'
import '../../body-classes/body'
import '../../content-lock/locker'
import '../../header/header/header'
import '../../error-pages/error-pages'
import '../../logout/logout'
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
