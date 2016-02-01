import view from '../../view/mixin';
import template from './template.jade';

export default class PrivilegesAlert extends view('appendable') {
  constructor (options = {}) {
    options.template = template;
    options.locals = {
      visibility: options.visibility,
      privileges: options.privileges
    };

    super(options);
  }
}
