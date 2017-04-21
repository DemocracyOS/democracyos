import 'native-promise-only'
import page from 'page'
import timeago from 'democracyos-timeago'
import config from 'lib/config/config'

import 'lib/boot/moment'
import 'lib/translations/translations'

/**
 * Register routes aliases
 */

import 'lib/boot/routes'

/**
 * Mount applications.
 */

import 'lib/analytics'
import 'lib/header/header'
import 'lib/error-pages/error-pages'
import 'lib/settings/settings/settings'
import 'lib/settings/forum-new/forum-new'
import 'lib/404/404'

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
