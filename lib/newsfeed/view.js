/**
 * Module dependencies
 */

import View from '../view/view';
import template from './template.jade'

export default class Newsfeed extends View {
  constructor() {
    super(template);
  }
}