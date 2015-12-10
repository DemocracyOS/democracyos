/**
 * Module Dependencies
 */

import template from './template.jade'
import View from '../view/view'

export default class NotificationsView extends View {
  constructor (notifications) {
    super(template, { notifications });
  }
}