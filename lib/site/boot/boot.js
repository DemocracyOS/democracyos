import '../polyfills/polyfills'
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'

/*
 * Setup Moment.js
 */

import 'lib/boot/moment'

import 'lib/analytics/analytics'
import 'lib/translations/translations'

/*
 * Register routes aliases
 */

import 'lib/boot/routes'

/*
 * Import Site Router
 */

import router from './router'

/*
 * Compose react app
 */

render(
  <Router history={browserHistory} onUpdate={track} routes={router} />,
  document.getElementById('root')
)

function track () {
  if (window.analytics) window.analytics.page(window.location.pathname)
  if (window.ga) window.ga('send', 'pageview', window.location.pathname)
}
