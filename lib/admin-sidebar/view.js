/**
 * Module dependencies.
 */

import template from './sidebar-template.jade';
import View from '../view/view.js';

/**
 * Creates `Sidebar` view for admin
 */

export default class Sidebar extends View {

  constructor() {
    super(template);
  }

  set(section) {
    this.unset();
    // Prune trailing subsection if they exist
    section = section && ~section.indexOf('/') ? section.split('/')[0] : section;
    let select = this.find('a[href="/admin/' + section + '"]').parent('li');
    select.addClass('active');
  }

  unset() {
    let actives = this.find(".active");
    actives.removeClass('active');

    return this;
  }

}