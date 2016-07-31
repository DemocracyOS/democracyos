import 'native-promise-only'
import page from 'page'
import './timeago-fix'
import timeago from 'democracyos-timeago'
import config from '../../config/config'

import '../../translations/translations'

/**
 * Enable client-side debug messages
 */

import '../../debug'

/**
 * Load currentUser
 */

import '../../user/user'

/**
 * Mount applications.
 */

import '../../settings-routes'
import '../../admin-routes'
import '../../analytics'
import '../../body-classes/body'
import '../../content-lock/locker'
import '../../header/header/header'
import '../../error-pages/error-pages'
import '../../site/help/help'
import '../../site/signin/signin'
import '../../site/signup/signup'
import '../../site/forgot/forgot'
import '../../site/notifications-page/notifications'
import '../../site/auth-facebook/auth-facebook'
import '../../site/logout/logout'
import '../../forum/forum'
import '../../site/homepage/homepage'
import '../../site/newsfeed/newsfeed'
import '../../site/topic/topic'
import '../../404/404'

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
