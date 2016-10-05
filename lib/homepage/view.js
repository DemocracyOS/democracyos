import view from '../view/mixin'
import template from './template.jade'

export default class HomeView extends view('appendable', 'withEvents') {
  constructor (options = {}) {
    options.template = template
    super(options)
  }
}
