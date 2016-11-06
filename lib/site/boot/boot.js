import 'native-promise-only'
import 'whatwg-fetch'
import {render} from 'react-dom'

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

render(router, document.getElementById('root'))
