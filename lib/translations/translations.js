/**
 * Module dependencies.
 */

import config from '../config/config.js'
import t from 't-component'

/**
 * Init `t` component with the locale provided by the server
 */

t[config.locale] = window.translations
t.lang(config.locale)
