/**
 * Module dependencies.
 */

import o from 'component-dom'
import config from '../config/config'

/**
 * Change head's title or restore with
 * one from config `organizationName`
 *
 * @param {String} str
 * @api public
 */

export default function title (str) {
  var title = config.organizationName + (str ? ' - ' + str : '')
  o('head title').html(title)
}
