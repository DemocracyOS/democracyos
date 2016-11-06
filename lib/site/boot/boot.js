import 'native-promise-only'
import 'whatwg-fetch'
import React from 'react'
import {render} from 'react-dom'
import {Router, browserHistory} from 'react-router'

import 'lib/analytics/analytics'
import 'lib/translations/translations'

/**
 * Enable client-side debug messages
 */

import 'lib/debug'

/*
 * Register routes aliases
 */

import 'lib/boot/routes'

/*
 * Setup Moment.js
 */

import './moment'

/*
 * Import Site Router
 */

import router from './router'

/*
 * Compose react app
 */

render((
  <Router history={browserHistory} onUpdate={track}>
    {router}
  </Router>
), document.getElementById('root'))

function track () {
  window.analytics.page(window.location.pathname)
}
