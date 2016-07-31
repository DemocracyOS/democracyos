import 'native-promise-only'
import page from 'page'
import './timeago-fix'
import timeago from 'democracyos-timeago'
import config from '../../config/config'

import '../../translations/translations'

/**
 * Mount applications.
 */

import '../../settings-routes'
import '../../forum/forum'
import '../../analytics'
import '../../body-classes/body'
import '../../content-lock/locker'
import '../../header/header/header'
import '../../error-pages/error-pages'
import '../../admin/admin/admin'
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
