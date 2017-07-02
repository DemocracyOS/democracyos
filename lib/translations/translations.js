/**
 * Module dependencies.
 */

import t from 't-component'
import config from '../config/config.js'

/**
 * Init `t` component with the locale provided by the server
 */

t[config.locale] = window.translations
t.lang(config.locale)
