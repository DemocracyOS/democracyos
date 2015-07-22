import view from '../../view/mixin';
import template from './template.jade';

export default class Filter extends view('appendable', 'removeable') {
  constructor (options) {
    options.template = template;
    super(options);
  }
}
